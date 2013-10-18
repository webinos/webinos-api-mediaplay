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

(function()
{
    Media = function(obj) {
        WebinosService.call(this, obj);
    };

    _webinos.registerServiceConstructor("http://webinos.org/api/mediaplay", Media);

    Media.prototype.bindService = function (bindCB, serviceId) {
	    if (typeof bindCB.onBind === 'function') {
		    bindCB.onBind(this);
	    };

        var rpc = webinos.rpcHandler.createRPC(this, "bindService");
        webinos.rpcHandler.executeRPC(rpc);
    }
    var rpcCB = {};

    Media.prototype.addListener = function(listeners, successCB, errorCB)
	{
        //should be checked if a rpcCB has been already created. So, it should be prevented an application to register multiple listeners.

        rpcCB = webinos.rpcHandler.createRPC(this, "addListener");

        rpcCB.onStop = rpcCB.onEnd = rpcCB.onPlay = rpcCB.onPause = rpcCB.onVolumeUP = rpcCB.onVolumeDOWN = rpcCB.onVolumeSet = function(){};

        if(typeof listeners.onStop === "function")
            rpcCB.onStop = listeners.onStop;

        if(typeof listeners.onEnd === "function")
            rpcCB.onEnd = listeners.onEnd;

        if(typeof listeners.onPlay === "function")
            rpcCB.onPlay = listeners.onPlay;

        if(typeof listeners.onPause === "function")
            rpcCB.onPause = listeners.onPause;

        if(typeof listeners.onVolume === "function")
            rpcCB.onVolume = listeners.onVolume;

        webinos.rpcHandler.registerCallbackObject(rpcCB);

        webinos.rpcHandler.executeRPC(rpcCB, function(params)
        {
            if (typeof(successCB) === 'function') successCB(params);
        }, function(error)
        {
            //unregister listener if fails to add it
            webinos.rpcHandler.unregisterCallbackObject(rpcCB);
            rpcCB = undefined;

            if (typeof(errorCB) !== 'undefined') errorCB(error);
        });
	}
	
	Media.prototype.removeAllListeners = function(successCB, errorCB)
    {
        var rpc = webinos.rpcHandler.createRPC(this, "removeAllListeners");
        webinos.rpcHandler.unregisterCallbackObject(rpcCB);

        webinos.rpcHandler.executeRPC(rpc, function(params)
            {
                if (typeof(successCB) === 'function') successCB(params);
            }, function(error)
            {
                    if (typeof(errorCB) !== 'undefined') errorCB(error);
            });
        rpcCB = undefined;
    }

    Media.prototype.isPlaying = function(successCB, errorCB)
    {
        var rpc = webinos.rpcHandler.createRPC(this, "isPlaying");
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            if (typeof(successCB) === 'function') successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
                errorCB(error);
        })
    }

    Media.prototype.play = function(URI, successCB, errorCB)
    {
        var rpc = webinos.rpcHandler.createRPC(this, "startPlay", [ URI ]);
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            if (typeof(successCB) === 'function')successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }

    Media.prototype.playPause = function(successCB, errorCB)
    {
       var rpc = webinos.rpcHandler.createRPC(this, "playPause");
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            if (typeof(successCB) === 'function')successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }

    Media.prototype.seek = function(step, successCB, errorCB)
    {
        var rpc = webinos.rpcHandler.createRPC(this, "seek", [ step ]);
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            if (typeof(successCB) === 'function')successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
                errorCB(error);
        })
    }

    Media.prototype.stop = function(successCB, errorCB)
    {
       var rpc = webinos.rpcHandler.createRPC(this, "stop");
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            if (typeof(successCB) === 'function')successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }

    Media.prototype.setVolume = function(volume, successCB, errorCB)
    {
        var rpc = webinos.rpcHandler.createRPC(this, "setVolume", [ volume ]);
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            if (typeof(successCB) === 'function')successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
                errorCB(error);
        })
    }

    Media.prototype.setSpeed = function(speed, successCB, errorCB)
    {
       var rpc = webinos.rpcHandler.createRPC(this, "setSpeed", [speed]);
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            if (typeof(successCB) === 'function')successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }

    Media.prototype.showInfo = function(successCB, errorCB)
    {
       var rpc = webinos.rpcHandler.createRPC(this, "showInfo");
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            if (typeof(successCB) === 'function')successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }

    Media.prototype.toggleSubtitle = function(successCB, errorCB)
    {
       var rpc = webinos.rpcHandler.createRPC(this, "toggleSubtitle");
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            if (typeof(successCB) === 'function')successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }

}());
