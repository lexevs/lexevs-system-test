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

var timeoutSeconds = 5000 * 1;

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
        .done(done);
	}, timeoutSeconds);
		
//*********************************************************************
// Test Query Outbound
//*********************************************************************
	it('Graph-resolve call: QueryOutbound', function (done) {  
	  frisby
      .timeout(timeoutSeconds)
      .get(baseURL + 'getOutbound/owl2lexevs/subClassOf/C61410')
	    .expect('status', 200)
        .expect('json', '?', {
            code:"C54443",
           	namespace: "owl2lexevs"
            })
        .done(done);
	}, timeoutSeconds);
    
//*********************************************************************
// Test Query Outbound ConceptInSubset
//*********************************************************************
	it('Graph-resolve call: QueryOutboundConceptInSubset', function (done) {  
	  frisby
      .timeout(timeoutSeconds)
      .get(baseURL + 'getOutbound/owl2lexevs/Concept_In_Subset/C48323')
	    .expect('status', 200)
        .expect('json', '?', {
            code:"C54453",
            code:"C117743",
           	namespace: "owl2lexevs"
            })
        .done(done);
	}, timeoutSeconds);
    
//*********************************************************************
// Test QueryInbound ConceptInSubset
//*********************************************************************
	it('Graph-resolve call: QueryOutboundConceptInSubset', function (done) {  
	  frisby
      .timeout(timeoutSeconds)
      .get(baseURL + 'getInbound/owl2lexevs/Concept_In_Subset/C48323')
	    .expect('status', 200)
        .expect('json', '?', {
            code:"C99998",
            code:"C99999",
            code:"C99988",
            code:"C99989",
           	namespace: "owl2lexevs"
            })
        .done(done);
	}, timeoutSeconds);
    
//*********************************************************************
// Test Query Inbound SubClassOf -- EXPECTING FAILURE
//*********************************************************************
	it('Graph-resolve call: QueryInBoundSubClassOf', function (done) {  
	  frisby
      .timeout(timeoutSeconds)
      .get(baseURL + 'getInbound/owl2lexevs/subClassOf/C19448')
	    .expect('status', 404)
        .done(done);
	}, timeoutSeconds);
    
//*********************************************************************
// Test Query InBound PhasPrognosis -- EXPECTING FAILURE
//*********************************************************************
	it('Graph-resolve call: TestQueryInBoundHasPrognosis', function (done) {  
	  frisby
      .timeout(timeoutSeconds)
      .get(baseURL + 'getInbound/owl2lexevs/patient_has_prognosis/CancerPatient')
	    .expect('status', 404)
        .done(done);
	}, timeoutSeconds);
      
//*********************************************************************
// Test Query OutBound HasPrognosis -- EXPECTING FAILURE
//*********************************************************************
	it('Graph-resolve call: TestQueryOutBoundPhasPrognosis', function (done) {  
	  frisby
      .timeout(timeoutSeconds)
      .get(baseURL + 'getOutbound/owl2lexevs/patient_has_prognosis/CancerPatient')
	    .expect('status', 404)
        .done(done);
	}, timeoutSeconds);
    
    
    
//*********************************************************************
// Test Query OutBound ConceptInSubset
//*********************************************************************
	it('Graph-resolve call: TestQueryOutBoundConceptInSubset', function (done) {  
	  frisby
      .timeout(timeoutSeconds)
      .get(baseURL + 'getOutbound/owl2lexevs/Concept_In_Subset/C48323')
	    .expect('status', 200)
        .expect('json', '?', {
            code:"C54453",
            code:"C117743",
            namespace: "owl2lexevs"
          })
        .done(done);
	}, timeoutSeconds);
      
//*********************************************************************
// Test Query OutBound ConceptInSubset2
//*********************************************************************
	it('Graph-resolve call: TestQueryOutBoundConceptInSubset2', function (done) {  
	  frisby
      .timeout(timeoutSeconds)
      .get(baseURL + 'getOutbound/owl2lexevs/Concept_In_Subset/C99999')
	    .expect('status', 200)
        .expect('json', '?', {
            code:"C48323",
            code:"C54453",
            code:"C117743",
            namespace: "owl2lexevs"
          })
        .done(done);
	}, timeoutSeconds);    
    
//*********************************************************************
// Test Query InBound ConceptInSubset 
//*********************************************************************
	it('Graph-resolve call: TestQueryInBoundConceptInSubset - only 4', function (done) {  
	  frisby
      .timeout(timeoutSeconds)
      .get(baseURL + 'getInbound/owl2lexevs/Concept_In_Subset/C48323')
	    .expect('status', 200)
        .expect('json', '?', {
            code:"C99998",
            code:"C99999",
            code:"C99988",
            code:"C99989",
            namespace: "owl2lexevs"
          })
        .done(done);
	}, timeoutSeconds); 
    
//*********************************************************************
// Test Query OutBound GeneRelatedToDisease  -- EXPECTING FAILURE 
//*********************************************************************
	it('Graph-resolve call: TestQueryOutBoundGeneRelatedToDisease', function (done) {  
	  frisby
      .timeout(timeoutSeconds)
      .get(baseURL + 'getOutbound/owl2lexevs/gene_related_to_disease/NeoplasticDisease')
	    .expect('status', 404)
        .done(done);
	}, timeoutSeconds); 
    
    
//*********************************************************************
// Test Query InBound ExactMatchCodeDepth1 
//*********************************************************************
	it('Graph-resolve call: TestQueryInBoundExactMatchCodeDepth1', function (done) {  
	  frisby
      .timeout(timeoutSeconds)
      .get(baseURL + 'getInbound/1/owl2lexevs/Concept_In_Subset/C48323')
	    .expect('status', 200)
        .expect('json', '?', {
            code:"C99998",
            code:"C99999",
            namespace: "owl2lexevs"
          })
        .done(done);
	}, timeoutSeconds); 
    
    
//*********************************************************************
// Test Query InBound ExactMatchCodeDepth2
//*********************************************************************
	it('Graph-resolve call: TestQueryInBoundExactMatchCodeDepth2', function (done) {  
	  frisby
      .timeout(timeoutSeconds)
      .get(baseURL + 'getInbound/2/owl2lexevs/Concept_In_Subset/C48323')
	    .expect('status', 200)
        .expect('json', '?', {
            code:"C99998",
            code:"C99999",
            code:"C99988",
            code:"C99989",
            namespace: "owl2lexevs"
          })
        .done(done);
	}, timeoutSeconds); 
        
	
//*********************************************************************
// Test Query OutBound ExactMatchCodeDepthPatient2 
//*********************************************************************
	it('Graph-resolve call: TestQueryOutBoundExactMatchCodeDepthPatient2', function (done) {  
	  frisby
      .timeout(timeoutSeconds)
      .get(baseURL + 'getOutbound/2/owl2lexevs/subClassOf/Patient')
	    .expect('status', 200)
        .expect('json', '?', {
            code:"Person",
            namespace: "owl2lexevs"
          })
        .done(done);
	}, timeoutSeconds); 
    
//*********************************************************************
// Test Query InBound ExactMatchCodeDepthPatient1 
//*********************************************************************
	it('Graph-resolve call: TestQueryInBoundExactMatchCodeDepthPatient1', function (done) {  
	  frisby
      .timeout(timeoutSeconds)
      .get(baseURL + 'getInbound/1/owl2lexevs/subClassOf/Patient')
	    .expect('status', 200)
        .expect('json', '?', {
            code:"HappyPatientDrivingAround",
            code:"HappyPatientWalkingAround",
            code:"HealthyPatient",
            code:"SickPatient",
            namespace: "owl2lexevs"
          })
        .done(done);
	}, timeoutSeconds); 
    
//*********************************************************************
// Test Query InBound ExactMatchCodeDepthPatient3
//*********************************************************************
	it('Graph-resolve call: TestQueryInBoundExactMatchCodeDepthPatient3', function (done) {  
	  frisby
      .timeout(timeoutSeconds)
      .get(baseURL + 'getInbound/3/owl2lexevs/subClassOf/Patient')
	    .expect('status', 200)
        .expect('json', '?', {
            code:"HappyPatientDrivingAround",
            code:"HappyPatientWalkingAround",
            code:"HealthyPatient",
            code:"SickPatient",
            code:"CancerPatient",
            code:"MildlySickPatient",
            code:"VerySickPatient",
            code:"MildlySickCancerPatient",
            code:"PatientWithCold",
            code:"VerySickCancerPatient",
            namespace: "owl2lexevs"
          })
        .done(done);
	}, timeoutSeconds); 
    
    
//*********************************************************************
// Test Query OutBound ExactMatchConceptInSubset2
//*********************************************************************
	it('Graph-resolve call: TestQueryOutBoundConceptInSubset2', function (done) {  
	  frisby
      .timeout(timeoutSeconds)
      .get(baseURL + 'getOutbound/2/owl2lexevs/Concept_In_Subset/C48323')
	    .expect('status', 200)
        .expect('json', '?', {
            code:"C54453",
            code:"C117743",
            namespace: "owl2lexevs"
          })
        .done(done);
	}, timeoutSeconds); 
    
    
});