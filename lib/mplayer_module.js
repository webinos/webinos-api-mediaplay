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
        api: 'http://webinos.org/api/media',
        displayName: 'MediaPlay - MPlayer',
        description: 'Webinos Media-Play API, MPlayer implementation'
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
    console.log("Media-Play: binded");
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
    playerInstance.instance = exec('mplayer -slave -input file=' + playerInstance.DEFAULT_PATH + playerInstance.pipe + ' ' + playerInstance.currentMedia + ' -volume '+playerInstance.volume);   
    
    //clean up the fifo unconditionally on close
    playerInstance.instance.on("close", function (exitCode) {                
        clearTimeout(playerInstance.timerID); //avoid timer to be called on stopped child
        
        if(playerInstance.oldInstance == null)  //closed a playerInstance with no oldInstance
        {
            callListeners("onEnd", playerInstance.currentMedia);
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
            errorCB("mplayer closed unexpectedly");
        }   
        else{
            console.log("successCB: mplayer init successfully ");
            successCB("successCB: mplayer playing with PID " + playerInstance.instance.pid);
            callListeners("onPlay", {"currentMedia": playerInstance.currentMedia, "volume": (playerInstance.volume-volumeRange.min)/volumeRange.step });
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
                    callListeners("onPlay", {"currentMedia": playerInstance.currentMedia, "volume": (playerInstance.volume-volumeRange.min)/volumeRange.step });
                } else {
                    callListeners("onPause");
                }
            break;
            case "q":                
                exec('echo '+key.toString()+' > ' + playerInstance.DEFAULT_PATH + playerInstance.pipe);
                callListeners("onStop");
            break;
            case "+":
                if(playerInstance.volume < volumeRange.max)
                {
                    playerInstance.volume+=volumeRange.step;
                    exec('echo "volume ' + playerInstance.volume + ' 1" > ' + playerInstance.DEFAULT_PATH + playerInstance.pipe);
                    callListeners("onVolumeUP", (playerInstance.volume-volumeRange.min)/volumeRange.step);
                }                
            break;
            case "-":
                if(playerInstance.volume > volumeRange.min)
                {
                    playerInstance.volume-=volumeRange.step;
                    exec('echo "volume ' + playerInstance.volume + ' 1" > ' + playerInstance.DEFAULT_PATH + playerInstance.pipe);
                    callListeners("onVolumeDOWN", (playerInstance.volume-volumeRange.min)/volumeRange.step);
                }                
            break;
            default:
                exec('echo '+key.toString()+' > ' + playerInstance.DEFAULT_PATH + playerInstance.pipe);
            break;
        }        
    }
    else
        if(typeof errorCB === 'function') errorCB("no mplayer process");
} 

MplayerModule.prototype.registerListeners = function(callbacks, successCB, errorCB, objectRef)
{        
    var currentLength = listeners.length;
    listeners.push(objectRef) > currentLength ? successCB("Media-play API registerListeners: " +  objectRef.from) : errorCB("Media-play API failed registerListeners");     
    console.log("Media-play API registerListeners: " +  objectRef.from);
}

MplayerModule.prototype.unregisterListenersOnLeave = function(params, successCB, errorCB, objectRef){    
    //indexOf does not work for complex objects
    for(var i=0;i<listeners.length;i++)
    {        
        if(listeners[i].from === objectRef.from)
        {
            listeners.splice(i, 1);            
            console.log("Media-play API unregisterListener: " + objectRef.from);
            successCB("Media-play: listener " + objectRef.from + " removed");
            return;
        }
    }    
    console.error("Media-play: listener " + objectRef.from + " not found");
    errorCB("Media-play: listener " + objectRef.from + "not found");
}

MplayerModule.prototype.unregisterListenersOnExit = function(params, successCB, errorCB, objectRef)
{       
    //indexOf does not work for complex objects
    for(var i=0;i<listeners.length;i++)
    {        
        if(listeners[i].from === objectRef.from)
        {
            listeners.splice(i, 1);            
            console.log("Media-play API unregisterListener: " + objectRef.from);
            return;
        }
    }    
    console.error("Media-play: listener " + objectRef.from + " not found");
}

function callListeners(type, payload)
{    
    var event = {};
    event.type = type;
    event.payload = (payload === undefined ? playerInstance.currentMedia : payload);
    
    console.log(event.type, event.payload);    
    
    if(typeof event.type !== "string")
        return;
    
    for(var i=0; i<listeners.length; i++)
    {
        var rpc = _rpcHandler.createRPC(listeners[i], event.type,  event);
        _rpcHandler.executeRPC(rpc);        
    }
}

MplayerModule.prototype.setVolume = function(volume, successCB, errorCB)
{            
        if(volume[0] >= 0 && volume[0] <= 30)
        {
            exec('echo "volume ' + volume[0]*volumeRange.step + ' 1" > ' + playerInstance.DEFAULT_PATH + playerInstance.pipe);
            playerInstance.volume = volume[0]*volumeRange.step;
            callListeners("onVolumeSet", volume[0]);
            successCB("Volume set to " + volume[0] + "/30");
        }
        else
            errorCB("Volume out of range");
}


MplayerModule.prototype.stepback = function (params, successCB, errorCB)
{
    "use strict";
    command('seek -3', successCB, errorCB);
}

MplayerModule.prototype.bigStepback = function (params, successCB, errorCB)
{
    "use strict";
    command('seek -20', successCB, errorCB);
}    

MplayerModule.prototype.stepforward = function (params, successCB, errorCB)
{
    "use strict";
    command('seek 3', successCB, errorCB);
}

MplayerModule.prototype.bigStepforward = function (params, successCB, errorCB)
{
    "use strict";
    var KEYS_UP="$'\e'[A";
    command('seek 20', successCB, errorCB);
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

MplayerModule.prototype.volumeUP = function (params, successCB, errorCB)
{
    "use strict";
    command('volume 2', successCB, errorCB);
}

MplayerModule.prototype.volumeDOWN = function (params, successCB, errorCB)
{
    "use strict";
    command('volume -2', successCB, errorCB);
}

MplayerModule.prototype.increasePlaybackSpeed = function (params, successCB, errorCB)
{
    "use strict";
    command('speed_incr 1', successCB, errorCB);
}

MplayerModule.prototype.decreasePlaybackSpeed = function (params, successCB, errorCB)
{
    "use strict";
    command('speed_incr -1', successCB, errorCB);
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