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

var OmxModule = function(rpcHandler, params) {
    // inherit from RPCWebinosService
    this.base = RPCWebinosService;
    this.rpcHandler = rpcHandler;
    this.base({
        api: 'http://webinos.org/api/mediaplay',
        displayName: 'MediaPlay - OmxPlayer',
        description: 'Webinos MediaPlay API, OmxPlayer implementation'
    });
};

OmxModule.prototype = new RPCWebinosService;


var listeners = [];
var volumeRange = {};
volumeRange.min = -5400;
volumeRange.max = 3600;
volumeRange.initialVolume = -2400;
var playerInstance = {};
playerInstance.pipe = 'webinosOmxPipe';
playerInstance.DEFAULT_PATH = '/tmp/';
playerInstance.instance = null;
playerInstance.timerID = null;
playerInstance.currentMedia = null;
playerInstance.playing = null;
playerInstance.oldInstance = null;
playerInstance.oldMedia = null;
playerInstance.volume = volumeRange.initialVolume;


OmxModule.prototype.bindService = function()
{
    console.log("MediaPlay: binded");
}


OmxModule.prototype.isPlaying = function(params, successCB, errorCB)
{
    try{
        var status = {};
        status.isPlaying = playerInstance.playing;
        status.currentMedia = playerInstance.currentMedia;
        status.volume = (playerInstance.volume-volumeRange.min)/300;
        successCB(status);
    }
    catch(e){errorCB(e)}; //errorCB should never be called
}

OmxModule.prototype.startPlay = function(path, successCB, errorCB)
{
    playerInstance.oldInstance = playerInstance.instance;
    playerInstance.oldMedia = playerInstance.currentMedia;
    playerInstance.volume = volumeRange.initialVolume; //reset volume
    playerInstance.playing = true;

    playerInstance.currentMedia = path[0];
    exec('killall omxplayer.bin');
    if (!fs.existsSync(playerInstance.DEFAULT_PATH + playerInstance.pipe))
    {
        exec('mkfifo ' + playerInstance.DEFAULT_PATH + playerInstance.pipe);
    }

    //Check for potential harmful characters for shell execution and escape them
    playerInstance.currentMedia = playerInstance.currentMedia.replace(/(["\s'$`\\])/g,'\\$1');

    //start the process
    playerInstance.instance = exec('omxplayer -r -o hdmi "' + playerInstance.currentMedia + '" --vol ' + playerInstance.volume + ' < ' + playerInstance.DEFAULT_PATH + playerInstance.pipe);

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
            //callListeners("onEnd", playerInstance.oldMedia); //slower than this.play and creates problems
        }
    });

    //required to start playback
    exec('echo \n > ' + playerInstance.DEFAULT_PATH + playerInstance.pipe);

    //handle the method invocation callbacks
    playerInstance.timerID = setTimeout(function(){
        if(playerInstance.instance.exitCode != null  && playerInstance.instance.stdout.destroyed)
        {
            console.log("errorCB: omxplayer destroyed");
            errorCB("ABORT_ERR");
        }
        else{
            console.log("successCB: omxplayer init successfully ");
            successCB("successCB: OmxPlayer playing with PID " + playerInstance.instance.pid);
            callListeners("onPlay", {"isPlaying": true,
                                     "currentMedia": playerInstance.currentMedia,
                                     "volume": (playerInstance.volume-volumeRange.min)/300
            });
        }
    }, 500);
};

function command(key, successCB, errorCB)
{
    "use strict";
    if(fs.existsSync(playerInstance.DEFAULT_PATH + playerInstance.pipe))
    {
        if(typeof successCB === 'function') successCB("command sent");

        switch(key.toString())
        {
            case "p":
                exec('echo -n '+key.toString()+' > ' + playerInstance.DEFAULT_PATH + playerInstance.pipe);
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
                exec('echo -n '+key.toString()+' > ' + playerInstance.DEFAULT_PATH + playerInstance.pipe);
                callListeners("onStop");
                break;
            default:
                exec('echo -n '+key.toString()+' > ' + playerInstance.DEFAULT_PATH + playerInstance.pipe);
                break;
        }
    }
    else
        if(typeof errorCB === 'function') errorCB("INVALID_ACCESS_ERR");
};

OmxModule.prototype.setVolume = function(volume, successCB, errorCB)
{
    var delta = Math.abs(Math.round(volume[0] - (playerInstance.volume-volumeRange.min)/300));
    if(volume[0] >= 0 && volume[0] <= 30)
    {
        if(((playerInstance.volume-volumeRange.min)/300) < volume[0]) //volumeUp
            exec('for i in `seq 1 '+ delta +'`; do echo -n + >> ' + playerInstance.DEFAULT_PATH + playerInstance.pipe + '; sleep 0.1; done');
        else //volumeDown
            exec('for i in `seq 1 '+ delta +'`; do echo -n - >> ' + playerInstance.DEFAULT_PATH + playerInstance.pipe + '; sleep 0.1; done');
        playerInstance.volume = volume[0]*300+volumeRange.min;
        callListeners("onVolume", (playerInstance.volume-volumeRange.min)/300);
        successCB("Volume shifted of " + delta + "/30");
    }
    else
        errorCB("QUOTA_EXCEEDED_ERR");
}

OmxModule.prototype.addListener = function(callbacks, successCB, errorCB, objectRef)
{
    var currentLength = listeners.length;
    listeners.push(objectRef) > currentLength ? successCB("MediaPlay API addListener: " +  objectRef.from) : errorCB("INVALID_ACCESS_ERR");
    console.log("MediaPlay API addListener: " +  objectRef.from);
};

OmxModule.prototype.removeAllListeners = function(params, successCB, errorCB, objectRef){
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

OmxModule.setRpcHandler = function(rpcHandler)
{
    _rpcHandler = rpcHandler;
}

function callListeners(type, payload)
{
    if(typeof type !== "string")
        return;

    for(var i=0; i<listeners.length; i++)
    {
        var rpc = (payload === undefined ? _rpcHandler.createRPC(listeners[i], type) : _rpcHandler.createRPC(listeners[i], type,  payload));
        _rpcHandler.executeRPC(rpc);
    }
}

OmxModule.prototype.seek = function (step, successCB, errorCB)
{
    "use strict";
    switch (step[0])
    {
        case "FORWARD":
            var KEYS_RIGHT="$'\e'[C";
            command(KEYS_RIGHT, successCB, errorCB);
            break;
        case "FORWARD_BIG":
            var KEYS_UP="$'\e'[A";
            command(KEYS_UP, successCB, errorCB);
            break;
        case "BACKWARD":
            var KEYS_LEFT="$'\e'[D";
            command(KEYS_LEFT, successCB, errorCB);
            break;
        case "BACKWARD_BIG":
            var KEYS_DOWN="$'\e'[B";
            command(KEYS_DOWN, successCB, errorCB);
            break;
        default:
            errorCB("SYNTAX_ERR");
    }
}

OmxModule.prototype.playPause = function (params, successCB, errorCB)
{
    "use strict";
    command('p', successCB, errorCB);
}

OmxModule.prototype.stop = function (params, successCB, errorCB)
{
    "use strict";
    command('q', successCB, errorCB);
}

OmxModule.prototype.setSpeed = function (speed, successCB, errorCB)
{
    "use strict";
        switch (speed[0])
        {
            case "FASTER":
                command('2', successCB, errorCB);
                break;
            case "SLOWER":
                command('1', successCB, errorCB);
                break;
            default:
                errorCB("INDEX_SIZE_ERR");
        }
}

OmxModule.prototype.showInfo = function (params, successCB, errorCB)
{
    "use strict";
    command('z', successCB, errorCB);
}

OmxModule.prototype.toggleSubtitle = function (params, successCB, errorCB)
{
    "use strict";
    command('s', successCB, errorCB);
}

module.exports = OmxModule;
