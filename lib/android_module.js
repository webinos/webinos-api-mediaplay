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

    this.isPlaying = function() {};

    this.stepforward = function() {};

    this.bigStepforward = function() {};

    this.stepback = function() {};

    this.bigStepback = function() {};

    this.stop = function() {};

    this.volumeUP = function() {};

    this.volumeDOWN = function() {};

    this.setVolume = function() {};

    this.increasePlaybackSpeed = function() {};

    this.decreasePlaybackSpeed = function() {};

    this.bindService = function() {};

    this.registerListeners = function() {};

    this.unregisterListenersOnLeave = function() {};

    this.unregisterListenersOnExit = function() {};
};

AndroidModule.prototype = new RPCWebinosService;

module.exports = AndroidModule;
