(function () {
    var net = require('net');
    var wPath = require("webinos-utilities").webinosPath.webinosPath()

    var Connection = (function () {

        function Connection(options) {
            this.options = options != null ? options : {};

            if (this.options.port == null) {
                this.options.port = 9090;
            }
            if (this.options.host == null) {
                this.options.host = '127.0.0.1';
            }
            if (this.options.user == null) {
                this.options.user = 'xbmc';
            }
            if (this.options.password == null) {
                this.options.password = false;
            }
            if (this.options.verbose == null) {
                this.options.verbose = false;
            }
            if (this.options.connectNow == null) {
                this.options.connectNow = true;
            }

            this.readRaw = '';

            if (this.options.connectNow) {
                this.create();
            }
        }

        Connection.prototype.create = function () {
            this.socket = net.connect({
                host: this.options.host,
                port: this.options.port
            });
            this.socket.sendQueue = [];
            this.socket.on('connect', this.onOpen());
            this.socket.on('data', this.onMessage());
            this.socket.on('end', this.onEnd());
            this.socket.on('error', this.onError);
            this.socket.on('disconnect', this.onClose);
            return this.socket.on('close', this.onClose);
        };

        Connection._id = 0;

        Connection.generateId = function () {
            return ++Connection._id;
        };

        Connection.prototype.isActive = function () {
            return (this.socket != null ? this.socket._connecting : void 0) === false;
        };

        Connection.prototype.send = function (data, callback) {
            if (!data) {
                throw new Error('Connection: Unknown arguments');
            }
            if ( data.id == null) {
             data.id = Connection.generateId();
             }
            if (!this.isActive()) {
                this.socket.sendQueue.push(data);
            } else {
                data.jsonrpc = '2.0';
                data = JSON.stringify(data);
                this.socket.write(data, function(){console.log("Media-Play API successCB: written on json2rpc socket with no error");});
            }
            if (typeof callback === "function") callback();
        };

        Connection.prototype.close = function (succesCB, errorCB) {
            try {
                this.socket.end();
                this.socket.destroy();
                if (typeof successCB == 'function') {
                    successCB();
                }
            } catch (err) {
                this.publish('error', err);
                if (typeof errorCB == 'function') {
                    errorCB(err);
                }
            }
        };

        Connection.prototype.onOpen = function () {
            var _this = this;

            return function(){
                return setTimeout((function () {
                    for (var i = 0; i < _this.socket.sendQueue.length; i++) {
                        _this.send(_this.socket.sendQueue[i]);
                    }
                    return _this.socket.sendQueue = [];
                }), 500);
            }
        };

        Connection.prototype.onError = function (evt) {
            console.log("Media-Play API: XBMC connection error " + evt);
        };

        Connection.prototype.onClose = function (evt) {
            console.log("Media-Play API: XBMC connection closed: " + evt);
        };

        Connection.prototype.onMessage = function () {
            _this = this;

            return function(buffer) {                                
                                
                try {
                    var stringBuffer = buffer.toString();
                    var sanitizedBuffer = JSON.parse('[' + stringBuffer.replace(/\}\{/g, '},{') + ']');
                    
                    for(var i=0;i<sanitizedBuffer.length;i++){
                        if(typeof sanitizedBuffer[i].method !== 'undefined')
                            console.log("Media-Play API: received data on json2rpc socket from method " + sanitizedBuffer[i].method);                        
                        if(typeof _this.callback == "function"){
                            _this.callback(sanitizedBuffer[i]);
                            sanitizedBuffer.length=0;
                        }
                    }
                } catch (err) {
                    console.log("Media-Play API error while receiving data from json2rpc socket: " + err);
                }
            };
        }

        Connection.prototype.onEnd = function () {
            _this = this;
            return function() {
                console.log("Media-Play API: json2rpc socket closed");
            };
        }

        return Connection;

    })();

    module.exports = Connection;

}).call(this);
