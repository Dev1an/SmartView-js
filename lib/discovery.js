const mdns = require('mdns');
const net = require('net');

const resolverSequence = [
    mdns.rst.DNSServiceResolve(),
    'DNSServiceGetAddrInfo' in mdns.dns_sd ? mdns.rst.DNSServiceGetAddrInfo() : mdns.rst.getaddrinfo({families:[4]}),
    mdns.rst.makeAddressesUnique()
];

module.exports = function(SmartView) {

	// Create an MDNS browser
	const smartViewBrowser = mdns.createBrowser(mdns.tcp('smartview'), {resolverSequence});

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
	if (service.addresses instanceof Array)
		for (var i = 0; i < service.addresses.length; i++)
			if (net.isIPv4(service.addresses[i]))
				return service.addresses[i]
}