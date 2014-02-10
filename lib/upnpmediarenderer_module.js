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

var UPnPMediaRendererModule = function(register, unregister, rpcHandler, params) {
    if (process.platform === 'android' || params && !params.useUPnP) {
        // useUPnP is needs to be true in config.json
        return;
    }

    var servicesMap = {};
    var upnp;
    try {
        upnp = require('peer-upnp');
    } catch(e) {}

    var peer = upnp.createPeer().start();

    peer.on('urn:schemas-upnp-org:service:AVTransport:1', function(service) {
        service.bind(function(boundService) {
            var webinosService = new MediaRendererService(rpcHandler, params, boundService, service.device);
            servicesMap[service.UDN] = webinosService;
            register(webinosService);

            service.on('disappear', function(vanishedService) {
                var origWebinosSv = servicesMap[vanishedService.UDN];
                if (origWebinosSv) {
                    console.log('unregistering', origWebinosSv.displayName);
                    unregister(origWebinosSv);
                    delete servicesMap[vanishedService.UDN];
                }
            });
        });
    });
};

var MediaRendererService = function(rpcHandler, params, service, device) {
    // inherit from RPCWebinosService
    this.base = RPCWebinosService;
    this.rpcHandler = rpcHandler;
    this.base({
        api: 'http://webinos.org/api/mediaplay',
        displayName: 'Media Play UPnP - ' + device.modelName,
        description: 'webinos MediaPlay API, UPnP MediaRenderer - ' + device.modelDescription
    });

    var listeners = [];
    var instance = {
      isPlaying: false,
      currentMedia: null
    };

    var _service = service;

    this.bindService = function(){
        console.log("MediaPlay: bound");
    };

    var isErr = function(res) {
        return res && res.name && res.name === 'UPnPError' ? true : false;
    };

    var callListeners = function(type, payload) {
        if (typeof type !== 'string') return;

        for (var i = 0; i < listeners.length; i++) {
            var rpc = (payload === undefined ? this.rpcHandler.createRPC(listeners[i], type) : this.rpcHandler.createRPC(listeners[i], type,  payload));
            this.rpcHandler.executeRPC(rpc);
        }
    };

    var play = function(uri, successCB, errorCB) {
        var that = this;
        _service.SetAVTransportURI({InstanceID: 0,
            CurrentURI: uri,
            CurrentURIMetaData: ''}, function(res) {
                if (isErr(res)) {
                    errorCB(res.message);
                    return;
                }
                _service.Play({InstanceID: 0,
                    Speed: 1}, function(res) {
                        if (isErr(res)) {
                            errorCB(res.message);
                            return;
                        }
                        instance = {isPlaying: true, currentMedia: uri};
                        callListeners.call(that, 'onPlay');
                        successCB();
                    });
            });
    };

    this.startPlay = function (params, successCB, errorCB) {
        if (params.length < 1 || typeof params[0] !== "string") {
            errorCB();
            return;
        }

        var that = this;
        _service.GetTransportInfo({InstanceID: 0}, function(res) {
            if (res.CurrentTransportState !== 'NO_MEDIA_PRESENT') {
                _service.Stop({InstanceID: 0}, function(res) {
                    instance = {isPlaying: true, currentMedia: null};
                    callListeners.call(that, 'onStop');
                    play.call(that, params[0], successCB, errorCB);
                });
            } else {
                play.call(that, params[0], successCB, errorCB);
            }
        });
    };

    this.playPause = function (params, successCB, errorCB) {
        var that = this;

        _service.GetTransportInfo({InstanceID: 0}, function(res) {
            if (isErr(res)) {
                errorCB(res.message);
                return;
            }
            if (res.CurrentTransportState === 'PLAYING') {
                _service.Pause({InstanceID: 0}, function(res) {
                    if (isErr(res)) {
                        errorCB(res.message);
                        return;
                    }
                    instance.playing = false;
                    callListeners.call(that, 'onPause');
                    successCB();
                });
            }
            else {
                _service.Play({InstanceID: 0, Speed: 1}, function(res) {
                    if (isErr(res)) {
                        errorCB(res.message);
                        return;
                    }
                    instance.playing = true;
                    callListeners.call(that, 'onPlay', instance.playing);
                    successCB();
                });
            }
        });
    };

    this.stop = function(params, successCB, errorCB) {
        var that = this;
        _service.Stop({InstanceID: 0}, function(res) {
                if (isErr(res)) {
                    errorCB(res.message);
                    return;
                }
                instance.playing = {isPlaying: false, currentMedia: null};
                callListeners.call(that, 'onStop');
                successCB();
            });
    };

    this.isPlaying = function(params, successCB, errorCB) {
        _service.GetTransportInfo({InstanceID: 0}, function(res) {
            if (isErr(res)) {
                errorCB(res.message);
                return;
            }
            var status = {
                isPlaying: false,
                currentMedia: ''/*,
                volume: 0,
                length: 0,
                position: 0*/
            };
            if (res.CurrentTransportState === 'PLAYING') {
                status.isPlaying = true;
            }
            successCB(status);
        });
    };

    this.seek = function(params, successCB, errorCB) {
        errorCB("NOT_SUPPORTED_ERR");
    };

    this.setVolume = function(params, params, successCB, errorCB) {
        errorCB("NOT_SUPPORTED_ERR");
    };

    this.setSpeed = function(params, successCB, errorCB) {
        errorCB("NOT_SUPPORTED_ERR");
    };

    this.showInfo = function (params, successCB, errorCB) {
        errorCB("NOT_SUPPORTED_ERR");
    };

    this.toggleSubtitle = function (params, successCB, errorCB) {
        errorCB("NOT_SUPPORTED_ERR");
    };

    this.addListener = function(params, successCallback, errorCallback, objectRef) {
        listeners.push(objectRef)
        successCallback()
    };

    this.removeAllListeners = function(params, successCallback, errorCallback, objectRef) {
        for (var i = 0; i < listeners.length; i++) {
            if (listeners[i].from === objectRef.from){
                listeners.splice(i, 1);
                return successCallback();
            }
        }
        errorCallback("NOT_FOUND_ERR");
    };
};

MediaRendererService.prototype = new RPCWebinosService;

module.exports = UPnPMediaRendererModule;
