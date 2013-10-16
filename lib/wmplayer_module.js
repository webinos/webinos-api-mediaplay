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

var WMplayerModule = function(rpcHandler, params){
    "use strict";
    // inherit from RPCWebinosService
    this.base = RPCWebinosService;
    this.rpcHandler = rpcHandler;
    this.base({
        api: 'http://webinos.org/api/mediaplay',
        displayName: 'MediaPlay - WMPlayer',
        description: 'Webinos MediaPlay API, Windows Media player implementation'
    });

}

WMplayerModule.prototype = new RPCWebinosService;

var listeners = [];
var volumeRange = {};
volumeRange.min = 0;
volumeRange.max = 30;
volumeRange.initialVolume = 10;
volumeRange.step = 3;
var playerInstance = {};
playerInstance.instance = null;
playerInstance.timerID = null;
playerInstance.currentMedia = null;
playerInstance.playing = false;
playerInstance.oldMedia = null;
playerInstance.volume = Math.round(volumeRange.initialVolume/volumeRange.step);
playerInstance.pid = false;


WMplayerModule.setRpcHandler = function(rpcHandler)
{
    "use strict";
    _rpcHandler = rpcHandler;
}


WMplayerModule.prototype.bindService = function()
{
    console.log("MediaPlay: binded");
}



WMplayerModule.prototype.isPlaying = function(params, successCB, errorCB)
{
    "use strict";
    try{
        var status = {};
        status.isPlaying = playerInstance.playing;
        status.currentMedia = playerInstance.currentMedia;
        status.volume = Math.round(playerInstance.volume*volumeRange.step);
        //check if application is still alive before sending the status
        successCB(status);
    }
    catch(e){errorCB(e)}; //errorCB should never be called
}

WMplayerModule.prototype.startPlay = function(path, successCB, errorCB)
{
    "use strict";
    playerInstance.oldMedia = playerInstance.currentMedia;
    playerInstance.volume = Math.round(volumeRange.initialVolume/volumeRange.step); //reset volume
    playerInstance.playing = true;

    playerInstance.currentMedia = path[0];

    //Check for potential harmful characters for shell execution and escape them
    playerInstance.currentMedia = playerInstance.currentMedia.replace(/(["\s'$`\\])/g,'\\$1');

    //load custom wmpControls c++ shared library
    fs.exists(__dirname.replace('lib', 'node_modules\\mediaWMplayerControls.node'), function(exists){
        if(exists){
            console.log("----------mediaWMplayerControls------------");
            playerInstance.instance = require(__dirname.replace('lib', 'node_modules\\mediaWMplayerControls.node'));
            playerInstance.currentMedia = playerInstance.currentMedia.replace('/', '\\');

            fs.exists(playerInstance.currentMedia, function(exists){
                if(exists){
                    playerInstance.pid = playerInstance.instance.command("open", playerInstance.currentMedia);

					if(playerInstance.pid !== false){
						exec('tasklist /fi "imagename eq wmplayer.exe"', function(stdin, stdout, stderr){
							if(stdout.match(/[\d]+/g)[0] !== null)    //probably not needed because at this stage wmp is already running
								playerInstance.pid = stdout.match(/[\d]+/g)[0];
							successCB("successCB: wmplayer playing with PID " + playerInstance.pid);
							callListeners("onPlay", {"isPlaying": true,
                                                     "currentMedia": playerInstance.currentMedia,
                                                     "volume": playerInstance.volume*volumeRange.step
                            });
						});
					}
					else{
						playerInstance.currentMedia = null;
						playerInstance.instance = null;
						playerInstance.playing = false;
						console.log("errorCB: wmplayer failed to open");
                        errorCB("ABORT_ERR");
					} 										
                }
                else
                    errorCB("NOT_FOUND_ERR");
            });
        }
        else
            errorCB("HIERARCHY_REQUEST_ERR");
    });
}

function command(key, successCB, errorCB)
{
    "use strict";
    if(playerInstance.pid !== false)
    {
        if(typeof successCB !== 'function')
            successCB = function(){};

        switch(key.toString())
        {
            case "pause":
                if(playerInstance.playing){
                    if(playerInstance.instance.command("pause") !== false){
                        playerInstance.playing = !playerInstance.playing;
                        successCB("pause command sent");
                        if (playerInstance.playing) {
                            callListeners("onPlay", {"isPlaying":true, "currentMedia": playerInstance.currentMedia, "volume": playerInstance.volume*volumeRange.step});
                        } else {
                            callListeners("onPause");
                        }
                    }
                    else
                        errorCB("INVALID_ACCESS_ERR");
                }
                else{
                    if(playerInstance.instance.command("play") !== false){
                        playerInstance.playing = !playerInstance.playing;
                        successCB("play command sent");
                        callListeners("onPause");
                    }
                    else
                        errorCB("INVALID_ACCESS_ERR");
                }
            break;
            case "q":
                if(playerInstance.instance.command("stop") !== false){
                    playerInstance.playing = false;
                    playerInstance.currentMedia = null;
                    exec('taskkill /fi "imagename eq wmplayer.exe"', function(stdin, stdout, stderr){
                        console.log("MediaPlay: killing all wmplayer instances");
                        if(stdout.indexOf('SUCCESS') > -1){
                             console.log(stdout);
                             successCB("stop command sent");
                             callListeners("onStop");
                        }
                        else
                            errorCB("INVALID_ACCESS_ERR");
                    });
                }
                else
                    errorCB("INVALID_ACCESS_ERR");
            break;
            case "+":
                if(playerInstance.volume*volumeRange.step < volumeRange.max)
                {
                    if(playerInstance.instance.command("volumeUP") !== false){
                        playerInstance.volume++;
                    }
                    else
                        errorCB("QUOTA_EXCEEDED_ERR");
                }
            break;
            case "-":
                if(playerInstance.volume*volumeRange.step > volumeRange.min)
                {
                    if(playerInstance.instance.command("volumeDOWN") !== false){
                        playerInstance.volume--;
                    }
                    else
                        errorCB("QUOTA_EXCEEDED_ERR");
                }
            break;
            default: break;
        }
    }
    else
        if(typeof errorCB === 'function') errorCB("INVALID_ACCESS_ERR");
}

WMplayerModule.prototype.registerListeners = function(callbacks, successCB, errorCB, objectRef)
{
    "use strict";
    var currentLength = listeners.length;
    listeners.push(objectRef) > currentLength ? successCB("MediaPlay API registerListeners: " +  objectRef.from) : errorCB("INVALID_ACCESS_ERR");
    console.log("MediaPlay API registerListeners: " +  objectRef.from);
}

WMplayerModule.prototype.removeAllListeners = function(params, successCB, errorCB, objectRef)
{
    "use strict";
    //indexOf does not work for complex objects
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
    "use strict";
    if(typeof type !== "string")
        return;

    for(var i=0; i<listeners.length; i++)
    {
        var rpc = (payload === undefined ? _rpcHandler.createRPC(listeners[i], type) : _rpcHandler.createRPC(listeners[i], type,  payload));
        _rpcHandler.executeRPC(rpc);
    }
}

WMplayerModule.prototype.setVolume = function(volume, successCB, errorCB)
{
    "use strict";
    if(volume[0] >= 0 && volume[0] <= 30)
    {
        var diff = playerInstance.volume-Math.round(volume[0]/volumeRange.step);
        if(diff<0)
            for(var i=0;i<Math.abs(diff);i++)
                command('+', function(success){}, errorCB);
        else if(diff>0)
            for(var i=0;i<Math.abs(diff);i++)
                command('-', function(success){}, errorCB);

        callListeners("onVolume", volume[0]);
        successCB("Volume set to " + volume[0] + "/30");
    }
    else
        errorCB("QUOTA_EXCEEDED_ERR");
}

WMplayerModule.prototype.seek = function (step, successCB, errorCB)
{
    "use strict";
    switch (step[0])
    {
        case "FORWARD":
            playerInstance.instance.command("step-forward") !== false ? successCB("command sent") : errorCB("INVALID_ACCESS_ERR");
            break;
        case "FORWARD_BIG":
            playerInstance.instance.command("bigStep-forward") !== false ? successCB("command sent") : errorCB("INVALID_ACCESS_ERR");
            break;
        case "BACKWARD":
            playerInstance.instance.command("step-backward") !== false ? successCB("command sent") : errorCB("INVALID_ACCESS_ERR");
            break;
        case "BACKWARD_BIG":
            playerInstance.instance.command("bigStep-backward") !== false ? successCB("command sent") : errorCB("INVALID_ACCESS_ERR");
            break;
        default:
            errorCB("SYNTAX_ERR");
    }
}

WMplayerModule.prototype.playPause = function (params, successCB, errorCB)
{
    "use strict";
    command('pause', successCB, errorCB);
}

WMplayerModule.prototype.stop = function (params, successCB, errorCB)
{
    "use strict";
    command('q', successCB, errorCB);
}

WMplayerModule.prototype.setSpeed = function (speed, successCB, errorCB)
{
    "use strict";
        switch (speed[0])
        {
            case "FASTER":
                playerInstance.instance.command("fast-forward") !== false ? successCB("command sent") : errorCB("INVALID_ACCESS_ERR");
                break;
            case "SLOWER":
                playerInstance.instance.command("media-rewind") !== false ? successCB("command sent") : errorCB("INVALID_ACCESS_ERR");
                break;
            default:
                errorCB("INDEX_SIZE_ERR");
        }
}

WMplayerModule.prototype.showInfo = function (params, successCB, errorCB)
{
    "use strict";
    errorCB("NOT_SUPPORTED_ERR");
}

WMplayerModule.prototype.toggleSubtitle = function (params, successCB, errorCB)
{
    "use strict";
    errorCB("NOT_SUPPORTED_ERR");
}

module.exports = WMplayerModule;