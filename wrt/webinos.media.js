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
    
    _webinos.registerServiceConstructor("http://webinos.org/api/media", Media);

    Media.prototype.bindService = function (bindCB, serviceId) {
	    if (typeof bindCB.onBind === 'function') {
		    bindCB.onBind(this);
	    };

        var rpc = webinos.rpcHandler.createRPC(this, "bindService");
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            if (typeof(successCB) === 'function')successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
                errorCB(error);
        })
    }
    var rpcCB = {};

	Media.prototype.registerListeners = function(callbacks, successCB, errorCB)
	{
        //should be checked if a rpcCB has been already created. So, it should be prevented an application to register multiple listeners.
        
        rpcCB = webinos.rpcHandler.createRPC(this, "registerListeners");
        
        rpcCB.onStop = rpcCB.onEnd = rpcCB.onPlay = rpcCB.onPause = rpcCB.onVolumeUP = rpcCB.onVolumeDOWN = rpcCB.onVolumeSet = function(){};

        if(typeof callbacks.onStop === "function") 
            rpcCB.onStop = callbacks.onStop;
        
        if(typeof callbacks.onEnd === "function") 
            rpcCB.onEnd = callbacks.onEnd;
        
        if(typeof callbacks.onPlay === "function") 
            rpcCB.onPlay = callbacks.onPlay;
        
        if(typeof callbacks.onPause === "function") 
            rpcCB.onPause = callbacks.onPause;

        if(typeof callbacks.onVolumeUP === "function") 
            rpcCB.onVolumeUP = callbacks.onVolumeUP;

        if(typeof callbacks.onVolumeDOWN === "function") 
            rpcCB.onVolumeDOWN = callbacks.onVolumeDOWN;
        
        if(typeof callbacks.onVolumeSet === "function") 
            rpcCB.onVolumeSet = callbacks.onVolumeSet;

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
	
	Media.prototype.unregisterListenersOnLeave = function(successCB, errorCB)
    {
        var rpc = webinos.rpcHandler.createRPC(this, "unregisterListenersOnLeave");        
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
        
    Media.prototype.unregisterListenersOnExit = function()
    {
        var rpc = webinos.rpcHandler.createRPC(this, "unregisterListenersOnExit");         
        webinos.rpcHandler.unregisterCallbackObject(rpcCB);

        webinos.rpcHandler.executeRPC(rpc);
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
    
    Media.prototype.play = function(path, successCB, errorCB)
    {
        var rpc = webinos.rpcHandler.createRPC(this, "startPlay", [ path ]);
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
    
    Media.prototype.stepforward = function(successCB, errorCB)
    {
       var rpc = webinos.rpcHandler.createRPC(this, "stepforward"); 
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            if (typeof(successCB) === 'function')successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
    Media.prototype.bigStepforward = function(successCB, errorCB)
    {
       var rpc = webinos.rpcHandler.createRPC(this, "bigStepforward");
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            if (typeof(successCB) === 'function')successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
    Media.prototype.stepback = function(successCB, errorCB)
    {
       var rpc = webinos.rpcHandler.createRPC(this, "stepback");
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            if (typeof(successCB) === 'function')successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
    Media.prototype.bigStepback = function(successCB, errorCB)
    {
       var rpc = webinos.rpcHandler.createRPC(this, "bigStepback");
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
    
    Media.prototype.volumeUP = function(successCB, errorCB)
    {
       var rpc = webinos.rpcHandler.createRPC(this, "volumeUP");
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            if (typeof(successCB) === 'function')successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
    Media.prototype.volumeDOWN = function(successCB, errorCB)
    {
       var rpc = webinos.rpcHandler.createRPC(this, "volumeDOWN");
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            if (typeof(successCB) === 'function')successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
    Media.prototype.setVolume = function(params, successCB, errorCB)
    {
        var rpc = webinos.rpcHandler.createRPC(this, "setVolume", [ params ]);
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            if (typeof(successCB) === 'function')successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
                errorCB(error);
        })
    }
    
    Media.prototype.increasePlaybackSpeed = function(successCB, errorCB)
    {
       var rpc = webinos.rpcHandler.createRPC(this, "increasePlaybackSpeed");
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            if (typeof(successCB) === 'function')successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
    Media.prototype.decreasePlaybackSpeed = function(successCB, errorCB)
    {
       var rpc = webinos.rpcHandler.createRPC(this, "decreasePlaybackSpeed");
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
