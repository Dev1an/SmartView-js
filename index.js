const net = require('net');
const util = require('util');
const events = require('events');
const discoverer = require('./lib/discovery');

const remotePort = 9992;

var SmartView = module.exports = function(address, listeners) {

	var self = this;

	events.EventEmitter.call(this);

	const connection = new net.Socket();
	connection.setEncoding('utf8');

	connection.on('data', function(data) {
		var header = data.slice(0, data.indexOf(':'));

		const body = {};
		data.split('\n').slice(1, -2).forEach(function(line) {
			const keyValue = line.split(': ');
			
			const key = camelize(keyValue[0]);
			const value = (key == 'version') ? keyValue[1] : inferType(keyValue[1]);
			
			body[key] = value;
		});

		self.emit(data);
		if (header.search('MONITOR') != -1)
			self.emit('monitorInfo', header, body);
	});

	connection.on('close', function() {
		self.emit('disconnect');
	});

	self.on('SMARTVIEW DEVICE', function(info) {
		self.emit('deviceInfo', info);
	});

	self.on('NETWORK', function(settings) {
		self.emit('networkSettings', settings);
	});

	for (var name in listeners) {
		self.on(name, listeners[name]);
	}




	Object.defineProperty(this, 'address', {
		set: function(newAddress) {
			if (net.isIPv4(newAddress)) {
				address = newAddress;
				if (connection.writable){
					connection.destroy();
					connection.connect(remotePort, address);
				}
			} else {
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
			connection.connect(remotePort, self.address, function() {
				self.emit('connected');
			});
		}
	};

	this.setBorder = function(monitorId, color) {
		var command = monitorId + ':\n';
		command += 'Border: ' + color + '\n\n';

		const buf = new Buffer(command, 'utf8');

		return connection.write(command);
	}

	this.address = address;
	if (typeof listeners != 'undefined') self.connect();
};

util.inherits(SmartView, events.EventEmitter);

discoverer(SmartView);

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

function inferType(stringValue) {
	if (!isNaN(stringValue))
		var value = eval(stringValue);
	else if (stringValue == 'false')
		var value = false;
	else if (stringValue == 'true')
		var value = true;
	else
		var value = stringValue

	return value;
}