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
			if (false && net.isIPv4(service.addresses[i])) {

				SmartView.emit('detected', address);

				break;
			}
		};

		console.log(address);
	});

	smartViewBrowser.start();
}