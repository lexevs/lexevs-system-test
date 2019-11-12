// Uses frisby.js REST API testing framework - http://frisbyjs.com/
//
// Example call to this file passing in the base graph-resolve URL and creating a junit report:
// jasmine-node --config baseURL http://graph-resolve:8080/ graph-resolveCalls_spec.js --junitreport
//
// Requirements:  These tests are writtent to be used as part of the 
// lexevs-system-tests suite: https://github.com/lexevs/lexevs-system-test
// using the content that is loaded during the lexevs-load.

var frisby = require('frisby');

const Joi = frisby.Joi; // Frisby exposes Joi for convenience

var timeoutSeconds = 1000 * 5;

// Get the parameter passed in from the command line
var baseURL = process.env['baseURL'];
console.log("Working with graph-resolve baseURL:" + baseURL);


describe('Graph-resolve integration tests', function() {

//*********************************************************************
// databases
//*********************************************************************
	it('Graph-resolve call: databases', function (done) {  
	  frisby
      .timeout(timeoutSeconds)
      .get(baseURL + 'databases')
	    .expect('status', 200)
//	    .expect('json', 'dataBases', {
//           	 	0: 'owl2lexevs'
//         	})
        .done(done);
	}, timeoutSeconds);
		
});