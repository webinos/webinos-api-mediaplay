/*******************************************************************************
 *    Code contributed to the webinos project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Copyright 2013 Istituto Superiore Mario Boella (ISMB)
 ******************************************************************************/

var fs = require("fs");
var exec = require('child_process').exec;
var RPCWebinosService = require('webinos-jsonrpc2').RPCWebinosService;

var _rpcHandler;

var MplayerModule = function(rpcHandler, params){
    // inherit from RPCWebinosService
    this.base = RPCWebinosService;
    this.rpcHandler = rpcHandler;
    this.base({
        api: 'http://webinos.org/api/mediaplay',
        displayName: 'MediaPlay - MPlayer',
        description: 'Webinos MediaPlay API, MPlayer implementation'
    });

}

MplayerModule.prototype = new RPCWebinosService;


var listeners = [];
var volumeRange = {};
volumeRange.min = 0;
volumeRange.max = 100;
volumeRange.initialVolume = 66;
volumeRange.step = 10/3;
var playerInstance = {};
playerInstance.pipe = 'webinosMplayerPipe';
playerInstance.DEFAULT_PATH = '/tmp/';
playerInstance.instance = null;
playerInstance.timerID = null;
playerInstance.currentMedia = null;
playerInstance.playing = null;
playerInstance.oldInstance = null;
playerInstance.oldMedia = null;
playerInstance.volume = volumeRange.initialVolume;


MplayerModule.prototype.bindService = function()
{
    console.log("MediaPlay: binded");
}


MplayerModule.setRpcHandler = function(rpcHandler)
{
    _rpcHandler = rpcHandler;
}

MplayerModule.prototype.isPlaying = function(params, successCB, errorCB)
{
    try{
        var status = {};
        status.isPlaying = playerInstance.playing;
        status.currentMedia = playerInstance.currentMedia;
        status.volume = Math.round(playerInstance.volume/volumeRange.step);
        successCB(status);
    }
    catch(e){errorCB(e)}; //errorCB should never be called
}

MplayerModule.prototype.startPlay = function(path, successCB, errorCB)
{
    playerInstance.oldInstance = playerInstance.instance;
    playerInstance.oldMedia = playerInstance.currentMedia;
    playerInstance.volume = volumeRange.initialVolume; //reset volume
    playerInstance.playing = true;

    playerInstance.currentMedia = path[0];
    exec('killall mplayer');
    if (!fs.existsSync(playerInstance.DEFAULT_PATH + playerInstance.pipe))
    {
        exec('mkfifo ' + playerInstance.DEFAULT_PATH + playerInstance.pipe);
    }

    //Check for potential harmful characters for shell execution and escape them
    playerInstance.currentMedia = playerInstance.currentMedia.replace(/(["\s'$`\\])/g,'\\$1');

    //start the process
    playerInstance.instance = exec('mplayer -slave -input file=' + playerInstance.DEFAULT_PATH + playerInstance.pipe + ' "' + playerInstance.currentMedia + '" -volume '+playerInstance.volume);

    //clean up the fifo unconditionally on close
    playerInstance.instance.on("close", function (exitCode) {
        clearTimeout(playerInstance.timerID); //avoid timer to be called on stopped child

        if(playerInstance.oldInstance == null)  //closed a playerInstance with no oldInstance
        {
            callListeners("onEnd");
            playerInstance.currentMedia = null;
            playerInstance.instance = null;
            playerInstance.playing = false;
            exec('rm '+ playerInstance.DEFAULT_PATH + playerInstance.pipe);
        }
        else
        {
            playerInstance.oldInstance = null;
        }
    });

    //handle the method invocation callbacks
    playerInstance.timerID = setTimeout(function(){
        if(playerInstance.instance.exitCode != null  && playerInstance.instance.stdout.destroyed)
        {
            console.log("errorCB: mplayer destroyed ");
            errorCB("ABORT_ERR");
        }
        else{
            console.log("successCB: mplayer init successfully ");
            successCB("successCB: mplayer playing with PID " + playerInstance.instance.pid);
            callListeners("onPlay", {"isPlaying": true,
                                     "currentMedia": playerInstance.currentMedia,
                                     "volume": (playerInstance.volume-volumeRange.min)/volumeRange.step
            });
        }
    }, 500);
}

function command(key, successCB, errorCB)
{
    "use strict";
    if(fs.existsSync(playerInstance.DEFAULT_PATH + playerInstance.pipe))
    {
        if(typeof successCB === 'function') successCB("command sent");

        switch(key.toString())
        {
            case "pause":
                exec('echo '+key.toString()+' > ' + playerInstance.DEFAULT_PATH + playerInstance.pipe);
                playerInstance.playing = !playerInstance.playing;
                if (playerInstance.playing) {
                    callListeners("onPlay", {"isPlaying": true,
                                             "currentMedia": playerInstance.currentMedia,
                                             "volume": (playerInstance.volume-volumeRange.min)/volumeRange.step
                    });
                } else {
                    callListeners("onPause");
                }
            break;
            case "q":
                exec('echo '+key.toString()+' > ' + playerInstance.DEFAULT_PATH + playerInstance.pipe);
                callListeners("onStop");
            break;
            default:
                console.log(key);
                exec('echo '+key.toString()+' > ' + playerInstance.DEFAULT_PATH + playerInstance.pipe);
            break;
        }
    }
    else
        if(typeof errorCB === 'function') errorCB("INVALID_ACCESS_ERR");
}

MplayerModule.prototype.addListener = function(params, successCB, errorCB, objectRef)
{
    var currentLength = listeners.length;
    listeners.push(objectRef) > currentLength ? successCB("MediaPlay API addListener: " +  objectRef.from) : errorCB("INVALID_ACCESS_ERR");
    console.log("MediaPlay API addListener: " +  objectRef.from);
}

MplayerModule.prototype.removeAllListeners = function(params, successCB, errorCB, objectRef)
{
    for(var i=0;i<listeners.length;i++)
    {
        if(listeners[i].from === objectRef.from)
        {
            listeners.splice(i, 1);
            console.log("MediaPlay API unregisterListener: " + objectRef.from);
            successCB("MediaPlay: listener " + objectRef.from + " removed");
            return;
        }
    }
    console.error("MediaPlay: listener " + objectRef.from + " not found");
    errorCB("NOT_FOUND_ERR");
}

function callListeners(type, payload)
{
    console.log("MediaPlay: sending event " + type + " with payload " + payload);

    if(typeof type !== "string")
        return;

    for(var i=0; i<listeners.length; i++)
    {
        var rpc = (payload === undefined ? _rpcHandler.createRPC(listeners[i], type) : _rpcHandler.createRPC(listeners[i], type,  payload));
        _rpcHandler.executeRPC(rpc);
    }
}

MplayerModule.prototype.setVolume = function(volume, successCB, errorCB)
{
        if(volume[0] >= 0 && volume[0] <= 30)
        {
            exec('echo "volume ' + volume[0]*volumeRange.step + ' 1" > ' + playerInstance.DEFAULT_PATH + playerInstance.pipe);
            playerInstance.volume = volume[0]*volumeRange.step;
            callListeners("onVolume", volume[0]);
            successCB("Volume set to " + volume[0] + "/30");
        }
        else
            errorCB("QUOTA_EXCEEDED_ERR");
}


MplayerModule.prototype.seek = function (step, successCB, errorCB)
{
    "use strict";
    switch (step[0])
    {
        case "FORWARD":
            command('seek 3', successCB, errorCB);
            break;
        case "FORWARD_BIG":
            command('seek 20', successCB, errorCB);
            break;
        case "BACKWARD":
            command('seek -3', successCB, errorCB);
            break;
        case "BACKWARD_BIG":
            command('seek -20', successCB, errorCB);
            break;
        default:
            errorCB("SYNTAX_ERR");
    }
}

MplayerModule.prototype.playPause = function (params, successCB, errorCB)
{
    "use strict";
    command('pause', successCB, errorCB);
}

MplayerModule.prototype.stop = function (params, successCB, errorCB)
{
    "use strict";
    command('q', successCB, errorCB);
}

MplayerModule.prototype.setSpeed = function (speed, successCB, errorCB)
{
    "use strict";
    switch (speed[0])
    {
        case "FASTER":
            command('speed_incr 1', successCB, errorCB);
            break;
        case "SLOWER":
            command('speed_incr -1', successCB, errorCB);
            break;
        default:
            errorCB("INDEX_SIZE_ERR");
    }
}

MplayerModule.prototype.showInfo = function (params, successCB, errorCB)
{
    "use strict";
    command('osd', successCB, errorCB);
}

MplayerModule.prototype.toggleSubtitle = function (params, successCB, errorCB)
{
    "use strict";
    command('sub_visibility', successCB, errorCB);
}

module.exports = MplayerModule;