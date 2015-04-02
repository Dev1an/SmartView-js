var SmartView = require('../');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("What's the ip address of your SmartView? ", function(answer) {

	SmartView.setBorder(answer, 'MONITOR A', 'Green', function(error){
		if (error) {
			console.log("A network error occured");
			console.log(e.stack);
		}
	});

	rl.close();
});