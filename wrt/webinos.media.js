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
		this.base = WebinosService;
		this.base(obj);
		
        this.play = play;
        this.playPause = playPause;
        this.stepforward = stepforward;
        this.stepback = stepback;
        this.bigStepforward = bigStepforward;
        this.bigStepback = bigStepback;
        this.stop = stop;
        this.volumeUP = volumeUP;
        this.volumeDOWN = volumeDOWN;
        this.increasePlaybackSpeed = increasePlaybackSpeed;
        this.decreasePlaybackSpeed = decreasePlaybackSpeed;
        this.showInfo = showInfo;
        this.toggleSubtitle = toggleSubtitle;
    };
    
    Media.prototype = new WebinosService;

    Media.prototype.bindService = function (bindCB, serviceId) {
	    // actually there should be an auth check here or whatever, but we just always bind
	    this.left = left;
		this.right = right;
        this.up = up;
        this.down = down;
        this.click = click;

	    if (typeof bindCB.onBind === 'function') {
		    bindCB.onBind(this);
	    };
    }
    

    
    function play (path, successCB, errorCB)
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
    
    function playPause (successCB, errorCB)
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
    
    function stepforward (successCB, errorCB)
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
    
    function bigStepforward (successCB, errorCB)
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
    
    function stepback (successCB, errorCB)
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
    
    function bigStepback (successCB, errorCB)
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
    
    function stop (successCB, errorCB)
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
    
    function volumeUP (successCB, errorCB)
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
    
    function volumeDOWN (successCB, errorCB)
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
    
    function increasePlaybackSpeed (successCB, errorCB)
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
    
    function decreasePlaybackSpeed (successCB, errorCB)
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
    
    function showInfo (successCB, errorCB)
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
    
    function toggleSubtitle (successCB, errorCB)
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
