const net = require('net');
const util = require('util');
const events = require('events');
const discoverer = require('./lib/discovery');


const remotePort = 9992;

var SmartView = module.exports = function(address) {

	var self = this;

	events.EventEmitter.call(this);

	const connection = new net.Socket();

	connection.on('message', function(data) {
		console.log(data);
	});





	Object.defineProperty(this, 'address', {
		set: function(newAddress) {
			if (net.isIPv4(newAddress)) {
				address = newAddress;
				if (connection.writable){
					connection.destroy();
					connection.connect(remotePort, address);
				}
			} else {
				console.log('invalid IPv4 address');
				// todo
				// emit error
				if (!net.isIPv4(address)) address = undefined;
			}
		},
		get: function() {
			return address;
		}
	});

	this.connect = function() {
		if (typeof this.address !== undefined) {
			connection.destroy();
			connection.connect(remotePort, self.address);
		}
	};

	this.address = address;
	this.connect();
};

util.inherits(SmartView, events.EventEmitter);

discoverer(SmartView);