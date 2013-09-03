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
 * Copyright 2013 Fraunhofer FOKUS
 ******************************************************************************/

var RPCWebinosService = require('webinos-jsonrpc2').RPCWebinosService;

var AndroidModule = function(rpcHandler, params) {
    // inherit from RPCWebinosService
    this.base = RPCWebinosService;
    this.rpcHandler = rpcHandler;
    this.base({
        api: 'http://webinos.org/api/media',
        displayName: 'MediaPlay - Android',
        description: 'Webinos Media-Play API, Android implementation'
    });

    var playbackManager;
    try {
        playbackManager = require('bridge').load('org.webinos.android.impl.media.PlaybackManagerImpl', this);
    } catch(e) {}

    this.startPlay = function (params, successCB, errorCB) {
        if (params.length < 1 || typeof params[0] !== "string") {
            errorCB();
        }
        playbackManager.play(params[0], function(err) {
            if (err) {
                errorCB("play error");
                return;
            }
            successCB("play success");
        });
    };

    this.playPause = function (params, successCB, errorCB) {
        playbackManager.playPause(function(err) {
            if (err) {
                errorCB("playPause error");
                return;
            }
            successCB("playPause success");
        });
    };

    this.isPlaying = function(successCB, errorCB) {
        
    };

    this.stepforward = function(successCB, errorCB) {
        
    };

    this.bigStepforward = function(successCB, errorCB) {
        
    };

    this.stepback = function(successCB, errorCB) {
        
    };

    this.bigStepback = function(successCB, errorCB) {
        
    };

    this.stop = function(successCB, errorCB) {
        
    };

    this.volumeUP = function(successCB, errorCB) {
        
    };

    this.volumeDOWN = function(successCB, errorCB) {
        
    };

    this.setVolume = function(params, successCB, errorCB) {
        
    };

    this.increasePlaybackSpeed = function(successCB, errorCB) {
        
    };

    this.decreasePlaybackSpeed = function(successCB, errorCB) {
        
    };
};

AndroidModule.prototype = new RPCWebinosService;

module.exports = AndroidModule;
