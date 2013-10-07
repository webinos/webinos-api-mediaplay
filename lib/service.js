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
    var wmplayer_module = require('./wmplayer_module.js');
    var upnp = require('./upnpScan');
    var xbmc_module = require('./xbmc_module.js');
    var AndroidModule = require('./android_module.js');
    var UPnPMediaRendererModule = require('./upnpmediarenderer_module.js');

    var  _rpcHandler;
    var upnpScan = new upnp.upnpScan();
 
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
        wmplayer_module.setRpcHandler(rpcHandler);
        xbmc_module.setRpcHandler(rpcHandler);
        this.registeredModules = [];
        this.register;
        this.unregister;
    };


    /*
    MediaApiModule.prototype.scanDevice = function(devices, that){
        console.log('------UPnP scan hit timeout------');
        console.log(devices);
        console.log('---------------------------------');

        for (var i=0; i<devices.length; i++)
        {
            if(!that.params)
                that.params = {};
            that.params.device = devices[i];
            console.log(devices[i]);
            if(!that.registeredModules[devices[i].uuid])
            {
                that.registeredModules[devices[i].uuid] = new xbmc_module(that.rpcHandler, that.params);
                that.register(that.registeredModules[devices[i].uuid]);
                console.log("Media-play API: XBMC implementation has been loaded");
            }

        }
        for (var i=0; i<that.registeredModules.length; i++)
        {
            var found = false;
            for (var j=0; j<devices.length; j++)
            {
                if (that.registeredModules[i] == devices[j])
                    found = true;
            }
            if(!found)
                that.unregister(that.registeredModules[i]);
        }

        setTimeout(upnpScan.scan, 5000, 5000, that, that.scanDevice);
    }
    */


    var scanDevice = function(devices, that){
        console.log('------UPnP scan hit timeout------');
        console.log(devices);
        console.log('---------------------------------');

        for (var i=0; i<devices.length; i++)
        {
            if(!that.params)
                that.params = {};
            that.params.device = devices[i];
            console.log(devices[i]);
            if(!that.registeredModules[devices[i].uuid])
            {
                that.registeredModules[devices[i].uuid] = new xbmc_module(that.rpcHandler, that.params);
                that.register(that.registeredModules[devices[i].uuid]);
                console.log("Media-play API: XBMC implementation has been loaded");
            }

        }
        for (var i=0; i<that.registeredModules.length; i++)
        {
            var found = false;
            for (var j=0; j<devices.length; j++)
            {
                if (that.registeredModules[i] == devices[j])
                    found = true;
            }
            if(!found)
                that.unregister(that.registeredModules[i]);
        }

        setTimeout(upnpScan.scan, 5000, 5000, that, scanDevice);
    }


     
    MediaApiModule.prototype.init = function(register, unregister)
    {
        this.register = register;
        this.unregister = unregister;
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
        else if(process.platform === "android"){
            register(new AndroidModule(this.rpcHandler, this.params));
            console.log("Media-play API: Android player implementation has been loaded");
        }
        else if(process.platform === "win32"){
            register(new wmplayer_module(this.rpcHandler, this.params));
            console.log("Media-play API: Windows Media player implementation has been loaded");
        }

        new UPnPMediaRendererModule(register, unregister, _rpcHandler, this.params);
        console.log("Media-play API: UPnP/DLNA player implementation has been loaded");

        upnpScan.scan(5000, this, scanDevice);
    };

    // export our object
    exports.Module = MediaApiModule;
})();
