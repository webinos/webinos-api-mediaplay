/*******************************************************************************
 *  Code contributed to the webinos project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *	 http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Copyright 2011 Fraunhofer FOKUS, ISMB
 ******************************************************************************/

describe("Mediaplay API", function() {
	var mediaplayService;    

    webinos.discovery.findServices(new ServiceType("http://webinos.org/api/mediaplay"), {
		onFound: function (unboundService) {
			unboundService.bindService({
				onBind: function(service){
					mediaplayService = service;
				}
			});			
		},
		onError: function(e){
			console.log("Error: " + e.message);
			expect(e).toBeUndefined();
			mediaplayService = e;
		}
	});
    
    beforeEach(function() {
		waitsFor(function() {
			return !!mediaplayService;
		}, "finding a mediaplay service", 2000);
	});
    
    
    it("could be found and be bound", function() {
		expect(mediaplayService).toBeDefined();
	});
    
    
    it("has the necessary properties as service object", function() {
		expect(mediaplayService.api).toEqual(jasmine.any(String));
		expect(mediaplayService.id).toEqual(jasmine.any(String));
		expect(mediaplayService.displayName).toEqual(jasmine.any(String));
		expect(mediaplayService.description).toEqual(jasmine.any(String));
		expect(mediaplayService.bindService).toEqual(jasmine.any(Function));
	});
    
    it("has the necessary properties and functions as MediaplayService API service", function() {
		expect(mediaplayService.addListener).toEqual(jasmine.any(Function));
		expect(mediaplayService.removeAllListeners).toEqual(jasmine.any(Function));
		expect(mediaplayService.isPlaying).toEqual(jasmine.any(Function));
		expect(mediaplayService.play).toEqual(jasmine.any(Function));
		expect(mediaplayService.playPause).toEqual(jasmine.any(Function));
		expect(mediaplayService.seek).toEqual(jasmine.any(Function));
		expect(mediaplayService.stop).toEqual(jasmine.any(Function));
		expect(mediaplayService.setVolume).toEqual(jasmine.any(Function));
		expect(mediaplayService.setSpeed).toEqual(jasmine.any(Function));
		expect(mediaplayService.showInfo).toEqual(jasmine.any(Function));
		expect(mediaplayService.toggleSubtitle).toEqual(jasmine.any(Function));
	});

    
    /*
    it("retrive contacts list", function() {
        var parameters = {};
        var results = false;
        if (contactsService)
        {
            parameters.fields = {};
            contactsService.find(parameters.fields, function(list){
                results = list;
            });
            
            waitsFor(function() {
			return results;
            }, "success callback has been called", 5000);
            
            runs(function() {
                contacts = results;
                expect(results).toBeDefined();
            }); 
        }
    });      */     
});
    
    
    
