const net = require('net');
const util = require('util');
const events = require('events');
var Future = require('fibers/future');

const makeDiscoverer = require('./lib/discovery');
const SmartViewConnection = require('./lib/connection');

const SmartView = module.exports = new events.EventEmitter();

SmartView.Connection = SmartViewConnection;

makeDiscoverer(SmartView);

module.exports.setBorder = function(address, monitor, color, callback) {
	new SmartViewConnection(address, {
		connected: function() {
			this.on('acknowledgement', function() {
				this.close();
				if (callback instanceof Function) callback();
			});
			this.setBorder(monitor, color);
		},
		error: function(error) {
			if (callback instanceof Function) callback(err);
		}
	});
}



// Because SmartViews can only have one TCP socket open at the same time
// we create a new connection for every request and close it when the
// SmartView sends a response

module.exports.getInfo = function(address, callback) {
	var deviceInfo = new Future();
	var monitorInfo = new Future();
	var monitors = [];
	var networkSettings = new Future();

	var task, connection;

	const timeout = setTimeout(function() {
		connection.close();
		const error = new Error('Timeout: the SmartView did not respond within 6 seconds');
		error.number = 1;
		setTimeout(callback, 50, error);
	}, 6000);

	task = Future.task(function() {
		connection = new SmartViewConnection(address, {
			deviceInfo: function(info) {
				deviceInfo.return(info);
			},
			monitorInfo: function(monitor, info) {
				monitors.push(info);
				info.id = monitor;

				if (monitors.length == deviceInfo.wait().monitors) {
					monitorInfo.return(monitors);
				}
			},
			networkSettings: function(settings) {
				networkSettings.return(settings);
			},
			error: function(error) {
				deviceInfo.throw(error);
			}
		});

		var error, info;
		try{
			var info = deviceInfo.wait();
			info.monitors = monitorInfo.wait();
			for (var key in networkSettings.wait()) {
				info[key] = networkSettings.wait()[key];
			}
			connection.close();
		} catch (e) {
			error = e;
		}
		clearTimeout(timeout);
		callback(error, info);
	});
	task.detach()
}