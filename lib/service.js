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
* Copyright 2011 Istituto Superiore Mario Boella (ISMB)
******************************************************************************/

(function() {
    "use strict";
    var path = require('path');
//     var moduleRoot = require(path.resolve(__dirname, '../dependencies.json'));
//     var dependencies = require(path.resolve(__dirname, '../' + moduleRoot.root.location + '/dependencies.json'));
//     var webinosRoot = path.resolve(__dirname, '../' + moduleRoot.root.location);
    var RPCWebinosService = require('webinos-jsonrpc2').RPCWebinosService;
    
    var media_module = require(path.resolve(__dirname,'media_module.js'));
    
    /**
     * Webinos Service constructor.
     * @param rpcHandler A handler for functions that use RPC to deliver their result.    
     */
    var Media = function(rpcHandler, params) {
        // inherit from RPCWebinosService
        this.base = RPCWebinosService;
        this.base({
            api: 'http://www.w3.org/ns/api-perms/media',
            displayName: 'MediaPlay',
            description: 'W3C Media Play Module'
        });

    };
    
    Media.prototype = new RPCWebinosService;

    //~ Media.prototype.play = function (successCB, errorCB)
    //~ {
        //~ "use strict";
        //~ 
        //~ media_modules.command('play', successCB, errorCB);
    //~ }

    Media.prototype.left = function (successCB, errorCB)
    {
        "use strict";
        //TODO should type be handled by this module?
        media_module.command('left', successCB, errorCB);
    }    
        
        
    Media.prototype.right = function (successCB, errorCB)
    {
        "use strict";
        //TODO should type be handled by this module?
        media_module.command('right', successCB, errorCB);
    }
    
    
    Media.prototype.up = function (successCB, errorCB)
    {
        "use strict";
        //TODO should type be handled by this module?
        media_module.command('up', successCB, errorCB);
    }
    
    Media.prototype.down = function (successCB, errorCB)
    {
        "use strict";
        //TODO should type be handled by this module?
        media_module.command('down', successCB, errorCB);
    }
    
    
    Media.prototype.click = function (successCB, errorCB)
    {
        "use strict";
        //TODO should type be handled by this module?
        media_module.command('select', successCB, errorCB);
    }
    
    Media.prototype.back = function (successCB, errorCB)
    {
        "use strict";
        //TODO should type be handled by this module?
        media_module.command('back', successCB, errorCB);
    }
    
    Media.prototype.play = function (successCB, errorCB)
    {
        "use strict";
        //TODO should type be handled by this module?
        media_module.command('playpause', successCB, errorCB);
    }
    
    Media.prototype.pause = function (successCB, errorCB)
    {
        "use strict";
        //TODO should type be handled by this module?
        media_module.command('pause', successCB, errorCB);
    }
    
    Media.prototype.stepforward = function (successCB, errorCB)
    {
        "use strict";
        //TODO should type be handled by this module?
        media_module.command('stepforward', successCB, errorCB);
    }
    
    Media.prototype.stepback = function (successCB, errorCB)
    {
        "use strict";
        //TODO should type be handled by this module?
        media_module.command('stepback', successCB, errorCB);
    }
    
    Media.prototype.stop = function (successCB, errorCB)
    {
        "use strict";
        //TODO should type be handled by this module?
        media_module.command('stop', successCB, errorCB);
    }
    
    
    
    // export our object
    exports.Service = Media;    
})()
