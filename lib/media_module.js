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
* Copyright 2011 Istituto Superiore Mario Boella (ISMB)
******************************************************************************/

var fs = require("fs");
var path = require("path");
var wPath = require("webinos-utilities").webinosPath.webinosPath() 
var xbmc = require('xbmc');

var omx = require('omxcontrol');

var connection, config, xbmcApi;

    connection = new xbmc.TCPConnection({
        host: "127.0.0.1",
        port: "9999",
        verbose: false
    });


    //config = require('./config');
    xbmcApi = new xbmc.XbmcApi({
        silent: true,
        connection: connection
    });


this.command = function(operation, succesCB, errorCB)
{
    if (omx)
    {
        omx.sendKey(operation);
        successCB();
    }
    else
        errorCB();
    
}
