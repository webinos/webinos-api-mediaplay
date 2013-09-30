var inspect = require('util').inspect;
var dgram = require('dgram');
var url = require('url');
var http = require('http');
var xbmcUpnpDevices = new Array();

Array.prototype.unique = function() {var o = {}, i, l = this.length, r = [];for(i=0; i<l;i+=1) o[this[i]] = this[i];for(i in o) r.push(o[i]);return r;};
String.prototype.between = function(prefix, suffix){
    var s = this, i = s.indexOf(prefix);
    (i>=0) ? s=s.substring(i+prefix.length) : s='';
    i = s.indexOf(suffix);    
    if(suffix) (suffix && i>=0) ? s = s.substring(0, i) : s='';
    return s;
}

const UNICAST_PORT = 40000;
const SSDP_PORT = 1900;
const BROADCAST_ADDR = "239.255.255.250";
const SSDP_MSEARCH   = "M-SEARCH * HTTP/1.1\r\nHost:"+BROADCAST_ADDR+":"+SSDP_PORT+"\r\nST:urn:schemas-upnp-org:device:MediaRenderer:1\r\nMan:\"ssdp:discover\"\r\nMX:5\r\n\r\n";
var message = new Buffer(SSDP_MSEARCH);

var upnpScan = function(){};

upnpScan.prototype.scan = function(timeout, callback){
    var server = dgram.createSocket('udp4');
    server.bind(UNICAST_PORT);
    server.on('message', function(msg, rinfo){               
        var upnpUrl = url.parse(msg.toString().match(/http:\/\/.*/g)[0]);
        
        http.get(upnpUrl, function(res) {
            var data = '';
            if(res.statusCode == 200){
                res.on("data", function(chunk) {
                    data+=chunk;
                });
                res.on('end', function(){
                    if(data.indexOf('XBMC') != -1)
                        xbmcUpnpDevices.push({'uuid': data.between("<UDN>","</UDN>").replace('uuid:', ''), 
                                              'ip': upnpUrl.hostname,
                                             'friendlyName': data.between("<friendlyName>","</friendlyName>")                                    
                        });
                });
            }            
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    });

    var client = dgram.createSocket("udp4");
    client.bind(UNICAST_PORT);
    client.send(message, 0, message.length, SSDP_PORT, BROADCAST_ADDR, function(err, bytes) {
        if (err != null)
            callback("UDP multicast message returns: " + err)
        client.close();
    });

    setTimeout(function(){
        server.close();
        delete client;
        delete server;
        callback(xbmcUpnpDevices.unique());
    }, timeout);
}

exports.upnpScan = upnpScan;
