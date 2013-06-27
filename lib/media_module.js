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

var omx = require('omxcontrol');

this.command = function(operation, successCB, errorCB)
{
    if(omx)
    {
        omx.sendKey(operation);
        successCB();
    }
    else
        errorCB();
    
}

this.startplay = function(path, successCB, errorCB)
{   
    if(omx)
    {
        if(fs.existsSync(path))
        {
            omx.start(path);
            successCB();
        }
        else
            errorCB("File not found");
    }
    else
        errorCB("omx module not found");
    
}
