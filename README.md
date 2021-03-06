# SmartView
Non blocking Blackmagic SmartView Ethernet Protocol implementation in Javascript (written for use with Node.js).

Because SmartView devices only allow one active connection at a time, we open a new connection for each action and close it again when the action is done. This way, when your application is idle (not sending messages to smartview devices), the SmartView will not be blocked and you will be able to connect to it from another application when you use this library.

## Installation
	npm install smartview

## Get information

To get information about a smartview:
```js
var address = "10.1.0.12"
SmartView.getInfo(address, function(error, information) {
	if (error) throw error;
	// do something with the received information information
});
```
### getInfo(address, callback)

- `address`

  The address of your smartview

- `callback` 

 A callback funciton that will be called with to arguments: `error` and `information`. The `information` argument will be an object like this:
	```js
	{
	    model : "SmartView HD",
	    hostname : "SmartViewHD-7c2e0d02ae3e",
	    name : "dPro SmartView HD",
	    monitors : [ 
	        {
	            brightness : 255,
	            contrast : 127,
	            saturation : 127,
	            identify : false,
	            border : "Green",
	            widescreenSD : "auto",
	            id : "MONITOR A"
	        }
	    ],
	    inverted : false,
	    dynamicIP : false,
	    staticAddress : "10.1.0.41",
	    staticNetmask : "255.255.255.0",
	    staticGateway : "192.168.0.1",
	    currentAddress : "10.1.0.41",
	    currentNetmask : "255.255.255.0",
	    currentGateway : "192.168.0.1"
	}
	```

## Change tally border
```js
var address = "10.1.0.12"
SmartView.setBorder(address, 'MONITOR A', 'Green', function(error){
	if (error) throw error;
});
```
### setBorder(address, monitor, color, callback)

- `address` The address of your smartview

- `monitor` The id of the monitor you want to control.

- `color`  The color of the tally border. You can choose between:
  - `"None"`
  - `"Red"`
  - `"Green"`
  - `"Blue"`


- `callback` A callback funciton that will be called when the tally border is set. When an error occures, for example when the SmartView is not reachable, an error will be provided as the first argument of the callback function.

## Auto discovery

To discover SmartViews in your network, add an event listener for the `detected` event:

```js
SmartView.on('detected', function(address) {
	// use the address for something
})
```
Then start discovering by calling the `startDiscovering` method:
```js
SmartView.startDiscovering();
```
