var SmartView = require('../');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("What's the ip address of your SmartView? ", function(answer) {

	SmartView.getInfo(answer, function(error, information) {
		if (error) {
			console.log('An error occured while trying to get your SmartView\'s information.');
			console.log(error.stack);
		} else {
			console.log("Here is the information about your SmartView");
			console.log(information);
		}
	});


	rl.close();
});