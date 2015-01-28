const mdns = require('mdns');
const net = require('net');

module.exports = function(SmartView) {

	// Make SmartView an EventEmitter instance
	events.EventEmitter.call(SmartView);
	for (var property in events.EventEmitter.prototype)
		SmartView[property] = events.EventEmitter.prototype[property];

	// Create an MDNS browser
	const smartViewBrowser = mdns.createBrowser(mdns.tcp('smartview'));

	smartViewBrowser.on('serviceUp', function(service) {
		SmartView.emit( 'detected', getIPv4Address(service) );
	});

	smartViewBrowser.on('serviceDown', function(service) {
		SmartView.emit( 'disappeared', getIPv4Address(service));
	});

	SmartView.startDiscovering = function(listener) {
		if (typeof listener == 'function') SmartView.on('detected', listener);
		smartViewBrowser.start();
	}
}

function getIPv4Address(service) {
	for (var i = 0; i < service.addresses.length; i++)
		if (net.isIPv4(service.addresses[i]))
			return service.addresses[i]
}