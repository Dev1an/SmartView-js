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
		for (var i = 0; i < service.addresses.length; i++) {
			if (net.isIPv4(service.addresses[i])) {

				SmartView.emit('detected', service.addresses[i]);

				break;
			}
		};
	});

	SmartView.startDiscovering = function(listener) {
		if (typeof listener == 'function') SmartView.on('detected', listener);
		smartViewBrowser.start();
	}
}