// This test makes use of a simulated BMD SmartView
// according to the "BMD SV Ethernet Protocol v1.3"
// described in the "installation and operation manual" (December 2014)

const net = require('net');
const assert = require('chai').assert;
const SmartView = require('../index');
const SVProtocol = require('./SmartViewProtocol');

const smartViewSimulator = net.createServer();
smartViewSimulator.listen(9992);

describe('Smartview', function() {
	describe('#getInfo()', function () {
		it('should receive all simulated information', function (done) {
			smartViewSimulator.once('connection', function(socket) {
				socket.write(new Buffer(SVProtocol.protocolPreamble));
				socket.write(new Buffer(SVProtocol.deviceInformation));
				socket.write(new Buffer(SVProtocol.networkConfiguration));
				socket.write(new Buffer(SVProtocol.monitorInformation));
			});

			SmartView.getInfo('0.0.0.0', function(error, information) {
				assert.deepEqual(information, SVProtocol.jsonInterpretation);
				done(error)
			})
		});

		it('should reassemble packages if the simulator splits them up', function(done) {
			smartViewSimulator.once('connection', function(socket) {
				socket.write(new Buffer(SVProtocol.protocolPreamble + SVProtocol.deviceInformation.slice(0,18)));
				socket.write(new Buffer(SVProtocol.deviceInformation.slice(18, 23)));
				socket.write(new Buffer(SVProtocol.deviceInformation.slice(23) + SVProtocol.networkConfiguration));
				socket.write(new Buffer(SVProtocol.monitorInformation));
			});

			SmartView.getInfo('0.0.0.0', function(error, information) {
				assert.deepEqual(information, SVProtocol.jsonInterpretation);
				done(error)
			})
		});

		it('should throw a timeout error when the SmartView does not respond', function(done) {
			this.timeout(6150);
			var socketClosed = false;

			smartViewSimulator.once('connection', function(socket) {
				socket.write(new Buffer(SVProtocol.protocolPreamble));
				socket.write(new Buffer(SVProtocol.deviceInformation));
				socket.write(new Buffer(SVProtocol.monitorInformation));

				socket.on('close', function() { socketClosed = true })
			});

			SmartView.getInfo('0.0.0.0', function(error, information) {
				assert.equal(error.number, 1);
				assert.equal(socketClosed, true);
				done()
			})
		});
	});
});