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
		
		this.left = left;
		this.right = right;
        this.up = up;
        this.down = down;
        this.click = click;
        this.back = back;
        this.play = play;
        this.pause = pause;
        this.stepforward = stepforward;
        this.stepback = stepback;
        this.stop = stop;
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
    
     function left (successCB, errorCB)
    {
        var rpc =webinos.rpcHandler.createRPC(this, "left"); // RPCservicename,
        //RPCservicename,
        // function
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }    
        
        
    function right (successCB, errorCB)
    {
       var rpc =webinos.rpcHandler.createRPC(this, "right"); // RPCservicename,
        //RPCservicename,
        // function
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
    
    function up (successCB, errorCB)
    {
        var rpc =webinos.rpcHandler.createRPC(this, "up"); // RPCservicename,
        //RPCservicename,
        // function
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
    function down (successCB, errorCB)
    {
        var rpc =webinos.rpcHandler.createRPC(this, "down"); // RPCservicename,
        //RPCservicename,
        // function
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
    
    function click (successCB, errorCB)
    {
       var rpc =webinos.rpcHandler.createRPC(this, "click"); // RPCservicename,
        //RPCservicename,
        // function
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
        function back (successCB, errorCB)
    {
       var rpc =webinos.rpcHandler.createRPC(this, "back"); // RPCservicename,
        //RPCservicename,
        // function
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
        function play (successCB, errorCB)
    {
       var rpc =webinos.rpcHandler.createRPC(this, "play"); // RPCservicename,
        //RPCservicename,
        // function
        webinos.rpcHandler.executeRPC(rpc, function(params)
        {
            successCB(params);
        }, function(error)
        {
            if (typeof(errorCB) !== 'undefined')
            errorCB(error);
        })
    }
    
        function pause (successCB, errorCB)
    {
       var rpc =webinos.rpcHandler.createRPC(this, "pause"); // RPCservicename,
        //RPCservicename,
        // function
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
       var rpc =webinos.rpcHandler.createRPC(this, "stepforward"); // RPCservicename,
        //RPCservicename,
        // function
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
       var rpc =webinos.rpcHandler.createRPC(this, "stepback"); // RPCservicename,
        //RPCservicename,
        // function
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
       var rpc =webinos.rpcHandler.createRPC(this, "stop"); // RPCservicename,
        //RPCservicename,
        // function
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
