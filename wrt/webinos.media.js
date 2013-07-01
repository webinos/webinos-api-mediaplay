/*******************************************************************************
 * Copyright 2011 Istituto Superiore Mario Boella (ISMB)
 *    
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *    
 *     http://www.apache.org/licenses/LICENSE-2.0
 *    
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

(function()
{
    Media = function(obj) {
        WebinosService.call(this, obj);
    };
    
    _webinos.registerServiceConstructor("http://webinos.org/api/media", Media);

    Media.prototype.bindService = function (bindCB, serviceId) {
	    // actually there should be an auth check here or whatever, but we just always bind
	    if (typeof bindCB.onBind === 'function') {
		    bindCB.onBind(this);
	    };
    }
    

    
    Media.prototype.play = function(path, successCB, errorCB)
    {
       var rpc =webinos.rpcHandler.createRPC(this, "playvideo", [ path ]);
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
    Media.prototype.playPause = function(successCB, errorCB)
    {
       var rpc =webinos.rpcHandler.createRPC(this, "playPause");
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
    Media.prototype.stepforward = function(successCB, errorCB)
    {
       var rpc =webinos.rpcHandler.createRPC(this, "stepforward"); 
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
    Media.prototype.bigStepforward = function(successCB, errorCB)
    {
       var rpc =webinos.rpcHandler.createRPC(this, "bigStepforward");
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
    Media.prototype.stepback = function(successCB, errorCB)
    {
       var rpc =webinos.rpcHandler.createRPC(this, "stepback");
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
    Media.prototype.bigStepback = function(successCB, errorCB)
    {
       var rpc =webinos.rpcHandler.createRPC(this, "bigStepback");
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
    Media.prototype.stop = function(successCB, errorCB)
    {
       var rpc =webinos.rpcHandler.createRPC(this, "stop");
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
    Media.prototype.volumeUP = function(successCB, errorCB)
    {
       var rpc =webinos.rpcHandler.createRPC(this, "volumeUP");
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
    Media.prototype.volumeDOWN = function(successCB, errorCB)
    {
       var rpc =webinos.rpcHandler.createRPC(this, "volumeDOWN");
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
    Media.prototype.increasePlaybackSpeed = function(successCB, errorCB)
    {
       var rpc =webinos.rpcHandler.createRPC(this, "increasePlaybackSpeed");
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
    Media.prototype.decreasePlaybackSpeed = function(successCB, errorCB)
    {
       var rpc =webinos.rpcHandler.createRPC(this, "decreasePlaybackSpeed");
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
    Media.prototype.showInfo = function(successCB, errorCB)
    {
       var rpc =webinos.rpcHandler.createRPC(this, "showInfo");
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            successCB(params);
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
            successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
}());
