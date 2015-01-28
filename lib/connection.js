const events = require('events');
const util = require('util');

const remotePort = 9992;

module.exports = function(address, listeners) {
	events.EventEmitter.call(this);

	var self = this;

	const socket = new net.Socket();
	socket.setEncoding('utf8');

	socket.on('data', function(data) {
		if (data.slice(0,3) == 'ACK') {
			self.emit('acknowledgement')
		} else {
			var header = data.slice(0, data.indexOf(':'));

			const body = {};
			data.split('\n').slice(1, -2).forEach(function(line) {
				const keyValue = line.split(': ');
				
				const key = camelize(keyValue[0]);
				const value = (key == 'version') ? keyValue[1] : inferType(keyValue[1]);
				
				body[key] = value;
			});

			self.emit(header, body);
			if (header.search('MONITOR') != -1)
				self.emit('monitorInfo', header, body);
		}
	});

	socket.on('close', function() {
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
				if (socket.writable){
					socket.destroy();
					socket.connect(remotePort, address);
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
			socket.destroy();
			socket.connect(remotePort, self.address, function() {
				self.emit('connected', self);
			});
		}
	};

	this.setBorder = function(monitorId, color, callback) {
		var command = monitorId + ':\n';
		command += 'Border: ' + color + '\n\n';

		const buf = new Buffer(command, 'utf8');

		return socket.write(command, callback);
	}

	this.close = function() {
		if (!socket.destroyed) {
			socket.destroy();
			console.log('destroyed TCP socket');
		}
	}

	this.address = address;
	if (typeof listeners != 'undefined') self.connect();
}

util.inherits(module.exports, events.EventEmitter);

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