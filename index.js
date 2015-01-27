const net = require('net');
const util = require('util');
const events = require('events');
const discoverer = require('./lib/discovery');


const remotePort = 9992;

var SmartView = module.exports = function(address) {
	events.EventEmitter.call(this);

	const connection = new net.Socket();

	Object.defineProperties(this, 'address', {
		set: function(newAddress) {
			if (net.isIPv4(newAddress)) {
				address = newAddress;
				if (socket.writable){
					connection.destroy();
					connection.connect(remotePort, address);
				}
			} else {
				console.log('invalid IPv4 address');
				// todo
				// emit error
			}
		},
		get: function() {
			return address;
		}
	});

	this.address = address;
};

util.inherits(SmartView, events.EventEmitter);

discoverer(SmartView);