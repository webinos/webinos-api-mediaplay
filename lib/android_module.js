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
var status = {};

var AndroidModule = function(rpcHandler, params) {
    // inherit from RPCWebinosService
    this.base = RPCWebinosService;
    this.rpcHandler = rpcHandler;
    this.base({
        api: 'http://webinos.org/api/mediaplay',
        displayName: 'MediaPlay - Android',
        description: 'Webinos Media-Play API, Android implementation'
    });

    var playbackManager;
    try {
        playbackManager = require('bridge').load('org.webinos.android.impl.media.PlaybackManagerImpl', this);
    } catch(e) {}

    this.bindService = function(){
        console.log("MediaPlay: bound");
    };

    this.startPlay = function (params, successCB, errorCB) {
        if (params.length < 1 || typeof params[0] !== "string") {
            errorCB("SYNTAX_ERR");
        }
        playbackManager.play(params[0], function(err) {
            if (err) {
                errorCB("ABORT_ERR");
                return;
            }
            successCB("play success");
        });
    };

    this.playPause = function (params, successCB, errorCB) {
        playbackManager.playPause(function(err) {
            if (err) {
                errorCB("ABORT_ERR");
                return;
            }
            successCB("playPause success");
        });
    };

    this.isPlaying = function(successCB, errorCB) {
        console.log(successCB)
        try{
           status.isPlaying = false;
           status.currentMedia = null;
           status.volume = 10;
           console.log("\n\n\nstatus");
           console.log(status.isPlaying);
           console.log(status.currentMedia);
           console.log(status.volume);
           successCB(status);
        }catch(e){errorCB(e)};
    };

    this.stop = function(successCB, errorCB) {
        errorCB("NOT_SUPPORTED_ERR");
    };

    this.seek = function(step, successCB, errorCB) {
        errorCB("NOT_SUPPORTED_ERR");
    };

    this.setVolume = function(params, successCB, errorCB) {
        errorCB("NOT_SUPPORTED_ERR");
    };

    this.setSpeed = function(speed, successCB, errorCB) {
        errorCB("NOT_SUPPORTED_ERR");
    };

    this.addListener = function(params, successCB, errorCB) {
        errorCB("NOT_SUPPORTED_ERR");
    };

    this.removeAllListeners = function(params, successCB, errorCB) {
        errorCB("NOT_SUPPORTED_ERR");
    };

    this.showInfo = function (params, successCB, errorCB) {
        errorCB("NOT_SUPPORTED_ERR");
    };

    this.toggleSubtitle = function (params, successCB, errorCB) {
        errorCB("NOT_SUPPORTED_ERR");
    };
};

AndroidModule.prototype = new RPCWebinosService;

module.exports = AndroidModule;
