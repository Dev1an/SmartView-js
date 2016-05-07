// Messages of "BMD SV Ethernet Protocol v1.3"
// described in the "installation and operation manual" (December 2014)

module.exports.protocolPreamble = [
	'PROTOCOL PREAMBLE:',
	'Version: 1.3',
	'', ''
].join('\n');

module.exports.deviceInformation = [
	'SMARTVIEW DEVICE:',
	'Model: SmartView Duo',
	'Hostname: stagefront.studio.example.com',
	'Name: StageFront',
	'Monitors: 1',
	'Inverted: false',
	'', ''
].join('\n');

module.exports.networkConfiguration = [
	'NETWORK:',
	'Dynamic IP: true',
	'Static address: 192.168.2.2',
	'Static netmask: 255.255.255.0',
	'Static gateway: 192.168.2.1',
	'Current address: 192.168.1.101',
	'Current netmask: 255.255.255.0',
	'Current gateway: 192.168.1.1',
	'', ''
].join('\n');

module.exports.monitorInformation = [
	'MONITOR A:',
	'Brightness: 255',
	'Contrast: 127',
	'Saturation: 127',
	'Identify: false',
	'Border: Green',
	'WidescreenSD: OFF',
	'', ''
].join('\n');

module.exports.jsonInterpretation = {
	model : "SmartView Duo",
	hostname : "stagefront.studio.example.com",
	name : "StageFront",
	monitors : [
		{
			brightness : 255,
			contrast : 127,
			saturation : 127,
			identify : false,
			border : "Green",
			widescreenSD : "OFF",
			id : "MONITOR A"
		}
	],
	inverted : false,
	dynamicIP : true,
	staticAddress : "192.168.2.2",
	staticNetmask : "255.255.255.0",
	staticGateway : "192.168.2.1",
	currentAddress : "192.168.1.101",
	currentNetmask : "255.255.255.0",
	currentGateway : "192.168.1.1"
}