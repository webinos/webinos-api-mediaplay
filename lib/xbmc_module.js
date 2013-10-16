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
var wPath = require("webinos-utilities").webinosPath.webinosPath();
var connectionLib = require('./connection.js');


var _rpcHandler;
var config;


var XbmcModule = function(rpcHandler, params)
{
    params.device.friendlyName = params.device.friendlyName.replace(/[^A-Za-z0-9]/gi, '_');

    this.base = RPCWebinosService;
    this.rpcHandler = rpcHandler;
    this._ip = params.device.ip;
    this.base({
        api: 'http://webinos.org/api/media',
        displayName: params.device.friendlyName,
        description: 'Webinos Media-Play API (XBMC) ' + params.device.friendlyName + ' ' + params.device.ip
    });

    this.command = function(operation, succesCB, errorCB)
    {
        var resp = "";

        switch(operation.toString())
        {
            case "playpause":
                playerInstance.playing = !playerInstance.playing;
                //callListeners("onPause");
                break;
            case "stop":
                //callListeners("onStop");
                break;
            case "volumeup":
                if(playerInstance.volume < volumeRange.max)
                {
                    volumeRange.max - playerInstance.volume > 1 ? playerInstance.volume+=2 : playerInstance.volume+=1;
                }
                break;
            case "volumedown":
                if(playerInstance.volume > volumeRange.min)
                {
                    playerInstance.volume - volumeRange.min > 1 ? playerInstance.volume-=2 : playerInstance.volume-=1;
                }
                break;
        }

        var dataP = {
            method:'Input.ExecuteAction',
            params: { action: operation.toString()}
        };

        this.connection.send(dataP);
    }

}


XbmcModule.prototype = new RPCWebinosService;

var listeners = [];
var volumeRange = {};
volumeRange.min = 0;
volumeRange.max = 30;
volumeRange.initialVolume = 10;
volumeRange.step = 10/3;

var playerInstance = {};
playerInstance.instance = null;
playerInstance.timerID = null;
playerInstance.currentMedia = null;
playerInstance.playing = null;
playerInstance.oldInstance = null;
playerInstance.oldMedia = null;
playerInstance.volume = volumeRange.initialVolume;


XbmcModule.setRpcHandler = function(rpcHandler)
{
    _rpcHandler = rpcHandler;
}


XbmcModule.prototype.bindService = function()
{
    if(typeof this.connection !== 'undefined'){
        this.connection.close();
        delete this.connection;
        console.log("Media-Play: deleted previously opened connection");
    }
    
    this.connection = new connectionLib({
        host: this._ip,
        port: 9090,
        user: "xbmc",
        password: '',
        verbose: false
    });

    this.connection.callback = callListeners(this);
    
    var dataVolume = {
        method: 'Application.SetVolume',
        params: { volume: Math.round(playerInstance.volume*volumeRange.step)}
    };
    this.connection.send(dataVolume);
}

XbmcModule.prototype.isPlaying = function(params, successCB, errorCB)
{
    try{
        var status = {};
        status.isPlaying = playerInstance.playing;
        status.currentMedia = playerInstance.currentMedia;
        status.volume = playerInstance.volume;
        if(typeof successCB == "function")successCB(status);
    }
    catch(e){errorCB(e)}; //errorCB should never be called
}


XbmcModule.prototype.startPlay = function(path, successCB, errorCB) 
{
    playerInstance.oldInstance = playerInstance.instance;
    playerInstance.oldMedia = playerInstance.currentMedia;
    playerInstance.volume = volumeRange.initialVolume; //reset volume
    playerInstance.playing = true;
    playerInstance.currentMedia = path[0];
    playerInstance.instance = "Now Playng "+ path[0]; 

    var dataVolume = {
        method: 'Application.SetVolume',
        params: { volume: 33 }
    };

    this.connection.send(dataVolume);

    var dataPlay = {
        method: 'Player.Open',
        params: {
            item: { file: playerInstance.currentMedia },
            options: {}
        }
    };

    this.connection.send(dataPlay);
}

XbmcModule.prototype.registerListeners = function(callbacks, successCB, errorCB, objectRef)
{        
    var currentLength = listeners.length;
    if (listeners.push(objectRef) > currentLength) 
        if(typeof successCB == "function")successCB("Media-play API registerListeners: " +  objectRef.from) 
    else    
        if(typeof errorCB == "function")errorCB("Media-play API failed registerListeners");     
    console.log("Media-play API registerListeners: " +  objectRef.from);
}

XbmcModule.prototype.unregisterListenersOnLeave = function(params, successCB, errorCB, objectRef)
{
    //indexOf does not work for complex objects
    for(var i=0;i<listeners.length;i++)
    {        
        if(listeners[i].from === objectRef.from)
        {
            listeners.splice(i, 1);            
            console.log("Media-play API unregisterListener: " + objectRef.from);
            if(typeof successCB == "function")successCB("Media-play: listener " + objectRef.from + " removed");
            return;
        }
    }    
    console.error("Media-play: listener " + objectRef.from + " not found");
    errorCB("Media-play: listener " + objectRef.from + "not found");
}

XbmcModule.prototype.unregisterListenersOnExit = function(params, successCB, errorCB, objectRef)
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

function callListeners(that)
{
    return function(event, payload){
        var _event = {};
//         if(event.result)
//         {
//             if(event.result.movies)
//             {
//                 fs.writeFile(wPath+"/userData/"+ that.displayName + "_Movies.json", JSON.stringify(event.result.movies));
//                 console.log("Media-Play API: caching movies list in" + wPath+"/userData/"+ that.displayName + "_Movies.json");
//                 //console.log(event.result.movies);
//                 return;
//             }
//         }

        switch(event.method)
        {
            case 'Application.OnVolumeChanged':
                console.log("Media-Play API: onVolumeSet Event");
                _event.type = "onVolumeSet";
                _event.payload = playerInstance.volume;
                playerInstance.volume = Math.round(event.params.data.volume/volumeRange.step);
                break;

            case 'Player.OnPlay':

                if (!playerInstance.playing && playerInstance.currentMedia )
                {
                    playerInstance.playing = !playerInstance.playing;
                    _event.type = "onPause";
                    _event.payload = playerInstance.currentMedia;
                }
                else
                {
                    playerInstance.playing = true;
                    _event.type = "onPlay";
                    _event.payload = {"currentMedia": playerInstance.currentMedia, "volume": playerInstance.volume};
                }
                break;

            case 'Player.OnPause':

                playerInstance.playing = false;
                _event.type = "onPause";
                _event.payload = playerInstance.currentMedia;

                break;

            case 'Player.OnStop':

                _event.type = "onStop";
                _event.payload = playerInstance.currentMedia;
                playerInstance.playing = false;
                playerInstance.currentMedia = null;

                break;

        }
        
        if(typeof _event.type !== "string")
            return;
        
        for(var i=0; i<listeners.length; i++)
        {
            var rpc = _rpcHandler.createRPC(listeners[i], _event.type,  _event);
            _rpcHandler.executeRPC(rpc);        
        }
    }
}

XbmcModule.prototype.setVolume = function(volume, successCB, errorCB)
{
    if(volume[0] >= 0 && volume[0] <= 30)
    {
        var dataVolume = {
            method: 'Application.SetVolume',
            params: { volume: Math.round(volume[0]*volumeRange.step)}
        };
        this.connection.send(dataVolume);

        playerInstance.volume = volume[0];
        if(typeof successCB == "function")successCB("Volume set to " + playerInstance.volume + "/30");
    }
    else
        if(typeof errorCB == "function")errorCB("Volume out of range");
}


XbmcModule.prototype.stepback = function (params, successCB, errorCB)
{
    "use strict";
    this.command('stepback', successCB, errorCB);
}

XbmcModule.prototype.bigStepback = function (params, successCB, errorCB)
{
    "use strict";
    this.command('bigstepback', successCB, errorCB);
}    

XbmcModule.prototype.stepforward = function (params, successCB, errorCB)
{
    "use strict";
    this.command('stepforward', successCB, errorCB);
}

XbmcModule.prototype.bigStepforward = function (params, successCB, errorCB)
{
    "use strict";
    this.command('bigstepforward', successCB, errorCB);
}

XbmcModule.prototype.playPause = function (params, successCB, errorCB)
{
    "use strict";
    this.command('playpause', successCB, errorCB);
}

XbmcModule.prototype.stop = function (params, successCB, errorCB)
{
    "use strict";
    this.command('stop', successCB, errorCB);
}

XbmcModule.prototype.volumeUP = function (params, successCB, errorCB)
{
    "use strict";
    this.command('volumeup', successCB, errorCB);
}

XbmcModule.prototype.volumeDOWN = function (params, successCB, errorCB)
{
    "use strict";
    this.command('volumedown', successCB, errorCB);
}

XbmcModule.prototype.increasePlaybackSpeed = function (params, successCB, errorCB)
{
    "use strict";
    this.command('fastforward', successCB, errorCB);
}

XbmcModule.prototype.decreasePlaybackSpeed = function (params, successCB, errorCB)
{
    "use strict";
    this.command('rewind', successCB, errorCB);
}

XbmcModule.prototype.showInfo = function (params, successCB, errorCB)
{
    "use strict";
    this.command('osd', successCB, errorCB);
}

XbmcModule.prototype.toggleSubtitle = function (params, successCB, errorCB)
{
    "use strict";
    this.command('showsubtitles', successCB, errorCB);
}


module.exports = XbmcModule;

