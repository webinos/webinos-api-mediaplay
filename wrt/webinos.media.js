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
    MediaPlay = function(obj) {
        WebinosService.call(this, obj);
    };
    
    _webinos.registerServiceConstructor("http://webinos.org/api/mediaplay", MediaPlay);

    MediaPlay.prototype.bindService = function (bindCB, serviceId) {
        if (typeof bindCB.onBind === 'function') {
            bindCB.onBind(this);
        };

        var rpc = webinos.rpcHandler.createRPC(this, "bindService");
        webinos.rpcHandler.executeRPC(rpc);
    };
    var rpcCB = {};

    MediaPlay.prototype.addListener = function(callbacks, successCB, errorCB) {
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

        webinos.rpcHandler.executeRPC(rpcCB, function(params) {
            if (typeof(successCB) === 'function') successCB(params);
        }, function(error) {
            //unregister listener if fails to add it
            webinos.rpcHandler.unregisterCallbackObject(rpcCB);
            rpcCB = undefined;

            if (typeof(errorCB) === 'function') errorCB(params);
        });
    };

    MediaPlay.prototype.removeAllListeners = function(successCB, errorCB) {
        var rpc = webinos.rpcHandler.createRPC(this, "unregisterListenersOnLeave");
        webinos.rpcHandler.unregisterCallbackObject(rpcCB);

        webinos.rpcHandler.executeRPC(rpc, function(params) {
            if (typeof(successCB) === 'function') successCB(params);
        }, function(error) {
            if (typeof(errorCB) === 'function') errorCB(params);
        });
        rpcCB = undefined;
    };

    MediaPlay.prototype.isPlaying = function(successCB, errorCB) {
        var rpc = webinos.rpcHandler.createRPC(this, "isPlaying");

        webinos.rpcHandler.executeRPC(rpc, function(params) {
            if (typeof(successCB) === 'function') successCB(params);
        }, function(error) {
            if (typeof(errorCB) === 'function') errorCB(params);
        });
    };

    MediaPlay.prototype.play = function(uri, successCB, errorCB) {
        var rpc = webinos.rpcHandler.createRPC(this, "startPlay", [ uri ]);
        webinos.rpcHandler.executeRPC(rpc, function(params) {
            if (typeof(successCB) === 'function') successCB(params);
        }, function(error) {
            if (typeof(errorCB) === 'function') errorCB(params);
        });
    };

    MediaPlay.prototype.playPause = function(successCB, errorCB) {
        var rpc = webinos.rpcHandler.createRPC(this, "playPause");
        webinos.rpcHandler.executeRPC(rpc, function(params) {
            if (typeof(successCB) === 'function') successCB(params);
        }, function(error) {
            if (typeof(errorCB) === 'function') errorCB(params);
        });
    };

    MediaPlay.prototype.stop = function(successCB, errorCB) {
        var rpc = webinos.rpcHandler.createRPC(this, "stop");
        webinos.rpcHandler.executeRPC(rpc, function(params) {
            if (typeof(successCB) === 'function') successCB(params);
        }, function(error) {
            if (typeof(errorCB) === 'function') errorCB(params);
        });
    };

    MediaPlay.prototype.seek = function(step, successCB, errorCB) {
        var stepsEnum = {
                "FORWARD": "stepforward",
                "FORWARD_BIG": "bigStepforward",
                "BACKWARD": "stepback",
                "BACKWARD_BIG": "bigStepback"
        };
        var method = stepsEnum[step];

        if (!method && typeof(errorCB) === 'function') {
            errorCB({name: "unknown step value"});
            return;
        }

        var rpc = webinos.rpcHandler.createRPC(this, method);
        webinos.rpcHandler.executeRPC(rpc, function(params) {
            if (typeof(successCB) === 'function') successCB(params);
        }, function(error) {
            if (typeof(errorCB) === 'function') errorCB(params);
        });
    };

    MediaPlay.prototype.setVolume = function(params, successCB, errorCB) {
        var rpc = webinos.rpcHandler.createRPC(this, "setVolume", [ params ]);
        webinos.rpcHandler.executeRPC(rpc, function(params) {
            if (typeof(successCB) === 'function') successCB(params);
        }, function(error) {
            if (typeof(errorCB) === 'function') errorCB(params);
        });
    };

    MediaPlay.prototype.setSpeed = function(speed, successCB, errorCB) {
        var speedEnum = {
                "FASTER": "increasePlaybackSpeed",
                "SLOWER": "decreasePlaybackSpeed"
        };
        var method = speedEnum[step];

        if (!method && typeof(errorCB) === 'function') {
            errorCB({name: "unknown step value"});
            return;
        }

        var rpc = webinos.rpcHandler.createRPC(this, method);
        webinos.rpcHandler.executeRPC(rpc, function(params) {
            if (typeof(successCB) === 'function') successCB(params);
        }, function(error) {
            if (typeof(errorCB) === 'function') errorCB(params);
        });
    };

}());
