var inspect = require('util').inspect;
var dgram = require('dgram');
var url = require('url');
var http = require('http');
var xbmcUpnpDevices = new Array();

function unique(vector){
    var o = {}, i, j, l = vector.length, r = new Array(); for(i=0; i<l;i++) o[vector[i].uuid] = vector[i]; for(j in o) r.push(o[j]);return r;
}
function between(source, prefix, suffix){
    var s = source, i = s.indexOf(prefix);
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

var responses = [];
var upnpScan = function(){};

upnpScan.prototype.scan = function(timeout, parent, callback){
    xbmcUpnpDevices.length = 0;
    responses.length = 0;
    var server = dgram.createSocket('udp4');
    server.bind(UNICAST_PORT);
    server.on('message', function(msg, rinfo){     
        responses.push(url.parse(msg.toString().match(/http:\/\/.*/g)[0]));
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
        
        for(var i= 0, j=0; i<responses.length; i++)
        {
            http.get(responses[i].href, function(res) {
                var data = '';
                if(res.statusCode == 200){
                    res.on("data", function(chunk) {
                        data+=chunk;
                    });
                    res.on('end', function(){                        
                        if(data.indexOf('XBMC') != -1)
                            xbmcUpnpDevices.push({
                                'uuid': between(data, "<UDN>","</UDN>").replace('uuid:', ''),
                                                 'ip': between(data, "<presentationURL>","</presentationURL>").match(/(\d{1,3}\.){3}\d{1,3}/g)[0],
                           'friendlyName': between(data, "<friendlyName>","</friendlyName>")
                            });
                           j++;
                        if(j == responses.length)
                            callback(unique(xbmcUpnpDevices), parent);
                    });
                }
            }).on('error', function(e) {
                console.log("Got error: " + e.message);
                j++;
                if(j == responses.length){
                    callback(unique(xbmcUpnpDevices), parent);
                }
            }).setTimeout(5000, function(){
                console.log("Media-Play: UPnP http request hits timeout and quitted");
                callback(unique(xbmcUpnpDevices), parent);
            });
        }
        if (responses.length == 0)
            callback(unique(xbmcUpnpDevices), parent);
    }, timeout);
}

exports.upnpScan = upnpScan;
