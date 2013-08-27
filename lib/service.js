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

(function(){
    "use strict";
    var path = require('path');
    var exec = require('child_process').exec;
    var RPCWebinosService = require('webinos-jsonrpc2').RPCWebinosService;
        
    var omx_module = require('./omx_module.js');    
    var mplayer_module = require('./mplayer_module.js');
    var  _rpcHandler;  
 
    /**
     * Webinos Service constructor.
     * @param rpcHandler A handler for functions that use RPC to deliver their result.    
     */     
    var MediaApiModule = function(rpcHandler, params)
    {
        _rpcHandler = rpcHandler;
        this.params = params;
        omx_module.setRpcHandler(rpcHandler);
        mplayer_module.setRpcHandler(rpcHandler);
    };
     
    MediaApiModule.prototype.init = function(register, unregister)
    {
        var players = {omx: null, mplayer: null};
        
        if(process.platform === "linux" || process.platform === "darwin"){
            players.mplayer = exec("hash mplayer");
            players.mplayer.on("close", function(exitCode){
                if(exitCode === 0){
                    register(new mplayer_module(this.rpcHandler, this.params));
                    console.log("Media-play API: mplayer implementation has been loaded");
                }
                else if(players.omx.exitCode !== 0)
                    console.log("Media-play API: supported players not found on this system");
            });
            players.omx = exec("hash omxplayer");
            players.omx.on("close", function(exitCode){
                if(exitCode === 0){
                    register(new omx_module(this.rpcHandler, this.params));
                    console.log("Media-play API: omxplayer implementation has been loaded");
                }
                else if(players.mplayer.exitCode !== 0)
                    console.log("Media-play API: supported players not found on this system");
            });
        }
    };
    
    // export our object
    exports.Module = MediaApiModule;    
})();
