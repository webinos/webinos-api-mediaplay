# webinos mediaplay API #

**Service Type**: http://webinos.org/api/mediaplay

webinos mediaplay api provides the interface to remotely control uPnP devices.

## Installation ##

To install the device discovery API you will need to npm the node module inside the webinos pzp.

For end users, you can simply open a command prompt in the root of your webinos-pzp and do: 

	npm install https://github.com/webinos/webinos-api-mediaplay.git

For developers that want to tweak the API, you should fork this repository and clone your fork inside the node_module of your pzp.

	cd node_modules
	git clone https://github.com/<your GitHub account>/webinos-api-mediaplay.git
	cd webinos-api-mediaplay
	npm install


## Getting a reference to the service ##

To discover the service you will have to search for the "http://webinos.org/api/discovery" type. Example:

	var serviceType = "http://webinos.org/api/mediaplay";
	webinos.discovery.findServices( new ServiceType(serviceType), 
		{ 
			onFound: serviceFoundFn, 
			onError: handleErrorFn
		}
	);
	function serviceFoundFn(service){
		// Do something with the service
	};
	function handleErrorFn(error){
		// Notify user
		console.log(error.message);
	}

Alternatively you can use the webinos dashboard to allow the user choose the mediaplay API to use. Example:
 	
	webinos.dashboard.open({
         module:'explorer',
	     data:{
         	service:[
            	'http://webinos.org/api/mediaplay'
         	],
            select:"services"
         }
     }).onAction(function successFn(data){
		  if (data.result.length > 0){
			// User selected some services
		  }
	 });

## Methods ##

Once you have a reference to an instance of a service you can use the following methods:

### addListener (listeners, successCB, errorCB) 

Add listener for the specified events. To use this method you should pass an object with the following structure:

	listeners{
		onStop: function(){ ... },
		onEnd: function(){ ... },
		onPlay: function(){ ... },
		onPause: function(){ ... },
		onVolumeUP: function(){ ... },
		onVolumeDOWN: function(){ ... },
		onVolumeSet: function(){ ... }
	}


### removeAllListeners (successCB, errorCB) 

Unregister all listeners.

### isPlaying (successCB, errorCB) 

Gets is the player is playing some media.

### play (URI, successCB, errorCB)

Play the given URI.

### playPause (successCB, errorCB) 

Toggle play pause state of the media.

### seek (step, successCB, errorCB)

Fast fwd or bwd based on the step.

### stop (successCB, errorCB)

Stop playing the media.

### setVolume (volume, successCB, errorCB)

Set the media volume to the given value. 

### setSpeed (speed, successCB, errorCB)

Set the playback speed.

### showInfo (successCB, errorCB)

Display media info.

### toggleSubtitle (successCB, errorCB)

Toggle subtitles visibility.
 

## Links ##

- [Examples](https://github.com/webinos/webinos-api-mediaplay/wiki/Examples)

