// Uses frisby.js REST API testing framework - http://frisbyjs.com/
//
// Example call to this file passing in the base CTS2 URL and creating a junit report:
// jasmine-node --config baseURL http://localhost:8181/cts2/ cts2Calls_spec.js --junitreport
//
// Requirements:  These tests are writtent to be used as part of the 
// lexevs-system-tests suite: https://github.com/lexevs/lexevs-system-test
// using the content that is loaded during the lexevs-load.

var frisby = require('frisby');

const Joi = frisby.Joi; // Frisby exposes Joi for convenience

var cts2Version = '1.3.3.FINAL';

// Get the parameter passed in from the command line
//var baseURL = 'http://localhost:8888/cts2_65/';
var baseURL = process.env['baseURL'];
console.log("Working with CTS2 baseURL:" + baseURL);


describe('CTS2 integration tests', function() {

//*********************************************************************
// service
//*********************************************************************
	it('CTS2 REST call: service', function (done) {
	  frisby.get(baseURL + 'service?format=json')
	    .expect('status', 200)
	    .expect('jsonTypes', 'BaseService', {
            serviceName: Joi.string(),
            serviceVersion: Joi.string(),
            implementationType: Joi.string()
         })
	    .expect('json', 'BaseService', {
            serviceVersion: cts2Version
         })
         .expect('json', 'BaseService.supportedProfile.?', {
            structuralProfile:"SP_VALUE_SET_DEFINITION",
    		structuralProfile:"SP_VALUE_SET",
   			structuralProfile:"SP_MAP_VERSION"
         })
        .timeout(60000) //waits 60sec for response    
	    .done(done);
	});

//*********************************************************************
// Count entities
//*********************************************************************
// 	it('CTS2 REST call: count entities', function (done) {
// 	  	frisby.get(baseURL + 'entities')
// 	    	.expect('status', 200)
// 	    	.done(done);
// 		});

//*********************************************************************
// entities - search (all)
//*********************************************************************
	it('CTS2 REST call: entities - search (all)', function (done) {
	  	frisby.get(baseURL + 'entities?maxtoreturn=50&format=json')
	    	.expect('status', 200)
	    	.expect('header','content-type', 'application/json;charset=UTF-8')
	    	.expect('json', 'EntityDirectory', {
           	 	numEntries: 50
         	})
         	.expect('json', 'EntityDirectory.heading', {
           	 	resourceURI: 'entities'
         	})
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});

//*********************************************************************
// entities search for automobile
//*********************************************************************
	it('CTS2 REST call: entities - entities search for automobile', function (done) {
	  	frisby.get(baseURL + 'entities?matchvalue=automobile&filtercomponent=resourceSynopsis&matchalgorithm=luceneQuery&maxtoreturn=50&format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
			.expect('json', 'EntityDirectory', {
           	 	numEntries: 1
         	})
			.expect('json', 'EntityDirectory.heading', {
           	 	resourceURI: 'entities'
         	})
         	.expect('json', 'EntityDirectory.entry.*', {
           	 	about: 'urn:oid:11.11.0.1:A0001',
         	})
         	.expect('json', 'EntityDirectory.entry.*.name', {
           	 	name: 'A0001'
         	})
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});
	    	
//*********************************************************************
// entities read 
//*********************************************************************

	it('CTS2 REST call: entities - read entity', function (done) {
	  	frisby.get(baseURL + 'codesystem/Automobiles/version/1.0/entity/VD005?format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
			.expect('json', 'EntityDescriptionMsg.entityDescription.namedEntity.describingCodeSystemVersion.version', {
           	 	content: 'Automobiles-1.0'
         	})
         	.expect('json', 'EntityDescriptionMsg.entityDescription.namedEntity.entityID', {
           	 	namespace: 'Automobiles',
           	 	name: 'VD005'
         	})
         	.expect('json', 'EntityDescriptionMsg.entityDescription.namedEntity.describingCodeSystemVersion.codeSystem', {
           	 	content: 'Automobiles',
           	 	uri: 'urn:oid:11.11.0.1'
         	})
         	.expect('jsonTypes', 'EntityDescriptionMsg.entityDescription.namedEntity', {
            	entryState: Joi.string(),
            	about: Joi.string()
          	})
            .timeout(60000) //waits 60sec for response 
	    	.done(done);
		});

//*********************************************************************
// codesystemversions - search all
//*********************************************************************
	it('CTS2 REST call: entities - codesystemversions - search all', function (done) {
	  	frisby.get(baseURL + 'codesystemversions?format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
			.expect('json', 'CodeSystemVersionCatalogEntryDirectory.entry.?', {
           	 	codeSystemVersionName: 'Automobiles-1.0'
         	})
         	.expect('json', 'CodeSystemVersionCatalogEntryDirectory.entry.?', {
           	 	codeSystemVersionName: 'Automobiles-1.0',
           	 	documentURI: 'urn:oid:11.11.0.1:1.0',
				officialResourceVersionId: '1.0',
				about: 'urn:oid:11.11.0.1:1.0',
				formalName: 'autos',
				
				codeSystemVersionName: 'GermanMadeParts-2.0',
           	 	documentURI: 'urn:oid:11.11.0.2:2.0',
				officialResourceVersionId: '2.0',
				about: 'urn:oid:11.11.0.2:2.0',
				formalName: 'GMP'
         	})
        	.expect('json', 'CodeSystemVersionCatalogEntryDirectory', {
           	 	complete: 'COMPLETE',
           	 	numEntries: 8
         	})
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});

//*********************************************************************
// codesystemversions - search automobile
//*********************************************************************
	it('CTS2 REST call: entities - codesystemversions - search automobile', function (done) {
	  	frisby.get(baseURL + 'codesystemversions?matchvalue=automobile&filtercomponent=resourceSynopsis&format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
			.expect('json', 'CodeSystemVersionCatalogEntryDirectory.entry.?', {
           	 	codeSystemVersionName: 'Automobiles-1.0',
           	 	officialResourceVersionId: '1.0',
				about: 'urn:oid:11.11.0.1:1.0',
				formalName: 'autos',
				
				codeSystemVersionName: 'Automobiles_extension-1.0[:]extension',
           	 	officialResourceVersionId: '1.0-extension',
				about: 'urn:oid:11.11.0.1.1-extension:1.0-extension',
				formalName: 'Automobiles Extension'
         	})
         	.expect('json', 'CodeSystemVersionCatalogEntryDirectory', {
           	 	complete: 'COMPLETE',
           	 	numEntries: 2
         	})
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});

//*********************************************************************
// codesystemversions - exact search Automobiles-1.0
//*********************************************************************
 	it('CTS2 REST call: entities - codesystemversions - exact search Automobiles-1.0', function (done) {
	  	frisby.get(baseURL + 'codesystemversions?matchvalue=Automobiles-1.0&filtercomponent=resourceName&matchalgorithm=exactMatch&format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
			.expect('json', 'CodeSystemVersionCatalogEntryDirectory.entry.?', {
           	 	codeSystemVersionName: 'Automobiles-1.0',
           	 	officialResourceVersionId: '1.0',
				about: 'urn:oid:11.11.0.1:1.0',
				formalName: 'autos'
         	})
         	.expect('json', 'CodeSystemVersionCatalogEntryDirectory', {
           	 	complete: 'COMPLETE',
           	 	numEntries: 1
         	})
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});
	
//*********************************************************************
// codesystemversion - read by version ID
//*********************************************************************
	it('CTS2 REST call: entities - read by version ID', function (done) {
	  	frisby.get(baseURL + 'codesystem/Automobiles/version/1.0?format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
			.expect('json', 'CodeSystemVersionCatalogEntryMsg.codeSystemVersionCatalogEntry', {
           	 	codeSystemVersionName: 'Automobiles-1.0',
           	 	documentURI: 'urn:oid:11.11.0.1:1.0',
           	 	officialResourceVersionId: '1.0',
				about: 'urn:oid:11.11.0.1:1.0',
				formalName: 'autos',
				state: 'FINAL',
				entryState: 'ACTIVE'
         	})
         	.expect('json', 'CodeSystemVersionCatalogEntryMsg.codeSystemVersionCatalogEntry.sourceAndNotation', {
           	 	sourceAndNotationDescription: 'LexEVS'
         	})
         	.expect('json', 'CodeSystemVersionCatalogEntryMsg.codeSystemVersionCatalogEntry.resourceSynopsis', {
           	 	value: 'Automobiles'
         	})
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});

//*********************************************************************
// codesystemversion - search entities
//*********************************************************************
	it('CTS2 REST call: codesystem - search entities', function (done) {
	  	frisby.get(baseURL + 'codesystem/Automobiles/version/1.0/entities?format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
			.expect('json', 'EntityDirectory.entry.?', {
           	 	about: 'urn:oid:11.11.0.1:C0011(5564)',
           	 	about: 'urn:oid:11.11.0.1:Ford',
           	 	about: 'urn:oid:11.11.0.1:A0001'
         	})
         	.expect('json', 'EntityDirectory.entry.*.name', {
           	 	namespace: 'Automobiles',
           	 	name: 'C0011(5564)',
           	 	
           	 	namespace: 'Automobiles',
           	 	name: 'Ford',
           	 	
           	 	namespace: 'Automobiles',
           	 	name: 'A0001'
         	})
         	.expect('json', 'EntityDirectory.entry.*.knownEntityDescription', {
//            	 	href: baseURL + 'codesystem/Automobiles/version/1.0/entity/C0011(5564)',
           	 	designation: 'Car With Trailer',
           	 	
//            	 	href: baseURL + 'codesystem/Automobiles/version/1.0/entity/Ford',
           	 	designation: 'Ford Motor Company',
           	 	
//            	 	href: baseURL + 'codesystem/Automobiles/version/1.0/entity/A0001',
           	 	designation: 'Automobile',
           	 	
//            	 	href: baseURL + 'codesystem/Automobiles/version/1.0/entity/Chevy',
           	 	designation: 'Chevrolet',           	 	
         	})
         	.expect('json', 'EntityDirectory', {
           	 	complete: 'COMPLETE',
           	 	numEntries: 22
         	})
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});

//*********************************************************************
// codesystemversion - read an entity by id
//*********************************************************************
	it('CTS2 REST call: codesystem - read an entity by id', function (done) {
	  	frisby.get(baseURL + 'codesystem/Automobiles/version/1.0/entity/A0001?format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
			
			.expect('json', 'EntityDescriptionMsg.entityDescription.namedEntity', {
           	 	entryState: 'ACTIVE',
           	 	about: 'urn:oid:11.11.0.1:A0001'
         	})
         	.expect('json', 'EntityDescriptionMsg.entityDescription.namedEntity.describingCodeSystemVersion.version', {
           	 	content: 'Automobiles-1.0',
//            	 	href: baseURL + 'codesystem/Automobiles/version/1.0'
         	})
         	.expect('json', 'EntityDescriptionMsg.entityDescription.namedEntity.entityID', {
           	 	namespace: 'Automobiles',
           	 	name: 'A0001'
         	})
         	.expect('json', 'EntityDescriptionMsg.entityDescription.namedEntity.designation.?', {
           	 	designationRole: 'PREFERRED',
           	 	value: 'Automobile'
         	})
         	.expect('json', 'EntityDescriptionMsg.entityDescription.namedEntity.entityType.?', {
           	 	uri: 'http://www.w3.org/2002/07/owl#Class',
           	 	namespace: 'owl',
           	 	name: 'Class'
         	})
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});

//*********************************************************************
// associations - get children
//*********************************************************************
	it('CTS2 REST call: codesystem - associations - get children', function (done) {
	  	frisby.get(baseURL + 'codesystem/Automobiles/version/1.0/entity/C0001/children?format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
				
			.expect('json', 'EntityDirectory', {
           	 	complete: "COMPLETE",
           	 	numEntries: 1
         	})
         	.expect('json', 'EntityDirectory.entry.?', {
           	 	about: 'urn:oid:11.11.0.1:C0011(5564)'
         	})
         	.expect('json', 'EntityDirectory.entry.*.name', {
           	 	namespace: 'Automobiles',
           	 	name: 'C0011(5564)'
         	})
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});

//*********************************************************************
// associations - subjectof
//*********************************************************************
	it('CTS2 REST call: codesystem - associations - subjectof', function (done) {
	  	frisby.get(baseURL + 'codesystem/Automobiles/version/1.0/entity/C0001/subjectof?format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
				
			.expect('json', 'AssociationDirectory', {
           	 	complete: "COMPLETE",
           	 	numEntries: 1
         	})
         	.expect('json', 'AssociationDirectory.entry.*.subject', {
           	 	uri: 'urn:oid:11.11.0.1:C0001',
           	 	namespace: 'Automobiles',
           	 	name: 'C0011'
         	})
         	.expect('json', 'AssociationDirectory.entry.*.predicate', {
           	 	uri: 'urn:oid:1.3.6.1.4.1.2114.108.1.8.1',
           	 	name: 'hasSubtype'
         	})   
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});

//*********************************************************************
// associations - targetof
//*********************************************************************
	it('CTS2 REST call: codesystem - associations - targetof', function (done) {
	  	frisby.get(baseURL + 'codesystem/Automobiles/version/1.0/entity/C0001/targetof?format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
				
			.expect('json', 'AssociationDirectory', {
           	 	complete: "COMPLETE",
           	 	numEntries: 1
         	})
         	.expect('json', 'AssociationDirectory.entry.*.subject', {
           	 	uri: 'urn:oid:11.11.0.1:C0001',
           	 	namespace: 'Automobiles',
           	 	name: 'C0011'
         	})
         	.expect('json', 'AssociationDirectory.entry.*.predicate', {
           	 	uri: 'urn:oid:1.3.6.1.4.1.2114.108.1.8.1',
           	 	name: 'hasSubtype'
         	})  
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});

//*********************************************************************
// valuesets - search (all)
//*********************************************************************
	it('CTS2 REST call: valuesets - search (all)', function (done) {
	  	frisby.get(baseURL + 'valuesets?format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
				
			.expect('json', 'ValueSetCatalogEntryDirectory', {
           	 	complete: "COMPLETE",
           	 	numEntries: 23
         	})
         	.expect('json', 'ValueSetCatalogEntryDirectory.entry.?', {
           	 	valueSetName: "Very Sick Cancer Patient",
           	 	about: 'OWL2LEXEVS:VerySickCancerPatient',
           	 	formalName: 'Very Sick Cancer Patient',
// 				href:  baseURL + 'valueset/Very Sick Cancer Patient',
				resourceName: 'Very Sick Cancer Patient',
				
				valueSetName: "All Domestic Autos But GM",
           	 	about: 'SRITEST:AUTO:AllDomesticButGM',
           	 	formalName: 'All Domestic Autos But GM',
// 				href:  baseURL + 'valueset/All Domestic Autos But GM',
				resourceName: 'All Domestic Autos But GM'
         	})
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});
	
//*********************************************************************
// valuesets - search (Auto)
//*********************************************************************
	it('CTS2 REST call: valuesets - search (Auto)', function (done) {
	  	frisby.get(baseURL + 'valuesets?matchvalue=Autos&filtercomponent=resourceName&maxtoreturn=50&matchalgorithm=contains&format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
				
			.expect('json', 'ValueSetCatalogEntryDirectory', {
           	 	complete: "COMPLETE",
           	 	numEntries: 4
         	})
         	.expect('json', 'ValueSetCatalogEntryDirectory.entry.?', {
           	 	valueSetName: "All Domestic Autos AND GM",
           	 	about: 'SRITEST:AUTO:AllDomesticANDGM',
           	 	formalName: 'All Domestic Autos AND GM',
// 				href:  baseURL + 'valueset/All Domestic Autos AND GM',
				resourceName: 'All Domestic Autos AND GM',

				valueSetName: "All Domestic Autos But GM",
           	 	about: 'SRITEST:AUTO:AllDomesticButGM',
           	 	formalName: 'All Domestic Autos But GM',
// 				href:  baseURL + 'valueset/All Domestic Autos But GM',
				resourceName: 'All Domestic Autos But GM'
         	})
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});

//*********************************************************************
// valuesets - read a valueset
//*********************************************************************
	it('CTS2 REST call: valuesets - read a valueset', function (done) {
	  	frisby.get(baseURL + 'valueset/All Domestic Autos AND GM?format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
				
			.expect('json', 'ValueSetCatalogEntryMsg.valueSetCatalogEntry', {
           	 	valueSetName: "All Domestic Autos AND GM",
           	 	about: 'SRITEST:AUTO:AllDomesticANDGM',
           	 	formalName: 'All Domestic Autos AND GM',
				entryState: 'ACTIVE',
         	})
         	.expect('json', 'ValueSetCatalogEntryMsg.valueSetCatalogEntry.currentDefinition.valueSetDefinition', {
           	 	uri: 'SRITEST:AUTO:AllDomesticANDGM'
         	})
         	.expect('json', 'ValueSetCatalogEntryMsg.valueSetCatalogEntry.currentDefinition.valueSet', {
           	 	content: 'All Domestic Autos AND GM'
         	})
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});

//*********************************************************************
// valuesets - resolve a valueset definition by id
//*********************************************************************
	it('CTS2 REST call: valuesets - resolve a valueset definition by id', function (done) {
	  	frisby.get(baseURL + 'valueset/All Domestic Autos But GM/definition/13ff5406?format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
				
			.expect('json', 'ValueSetDefinitionMsg.valueSetDefinition', {
           	 	documentURI: 'SRITEST:AUTO:AllDomesticButGM',
           	 	about: 'SRITEST:AUTO:AllDomesticButGM',
           	 	state: 'FINAL',
           	 	formalName: 'SRITEST:AUTO:AllDomesticButGM',
				entryState: 'ACTIVE',
         	})
         	.expect('json', 'ValueSetDefinitionMsg.valueSetDefinition.definedValueSet', {
           	 	content: 'All Domestic Autos But GM',
         	})
         	.expect('json', 'ValueSetDefinitionMsg.valueSetDefinition.entry.?', {
           	 	operator: 'UNION',
           	 	entryOrder: 1,
           	 	
           	 	operator: 'SUBTRACT',
           	 	entryOrder: 2
         	})
         	.expect('json', 'ValueSetDefinitionMsg.valueSetDefinition.entry.*.associatedEntities', {
           	 	direction: 'SOURCE_TO_TARGET',
           	 	leafOnly: 'ALL_INTERMEDIATE_NODES',
           	 	transitivity: 'TRANSITIVE_CLOSURE',
         	})
         	.expect('json', 'ValueSetDefinitionMsg.valueSetDefinition.sourceAndNotation', {
           	 	sourceAndNotationDescription: 'LexEVS'
         	})
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});

//*********************************************************************
// valuesets - search all pre-resolved value set definitions
//*********************************************************************
	it('CTS2 REST call: valuesets - search all pre-resolved value set definitions', function (done) {
	  	frisby.get(baseURL + 'resolvedvaluesets?format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
			.expect('json', 'ResolvedValueSetDirectory', {
           	 	complete: "COMPLETE",
           	 	numEntries: 8
         	})
         	.expect('json', 'ResolvedValueSetDirectory.entry.?', {
           	 	resolvedValueSetURI: "SRITEST:AUTO:AllDomesticButGM",
           	 	resolvedValueSetURI: "SRITEST:AUTO:AllDomesticButGMWithlt250charName"
         	})   
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});

//*********************************************************************
// maps - search map version summaries (empty search)
//*********************************************************************
	it('CTS2 REST call: maps - search map version summaries (empty search)', function (done) {
	  	frisby.get(baseURL + 'mapversions?format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
			.expect('json', 'MapVersionDirectory', {
           	 	complete: "COMPLETE",
           	 	numEntries: 1
         	})
         	.expect('json', 'MapVersionDirectory.entry.?', {
           	 	mapVersionName: "Mapping Sample-1.0",
           	 	documentURI: "urn:oid:mapping:sample",
           	 	about: 'urn:oid:mapping:sample',
           	 	formalName: 'MappingSample',
//            	 	href: baseURL + 'map/Mapping Sample/version/Mapping Sample-1.0'
         	})       
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});

//*********************************************************************
// maps - search map version summaries (with search criteria)
//*********************************************************************
	it('CTS2 REST call: maps - search map version summaries (with search criteria)', function (done) {
	  	frisby.get(baseURL + 'mapversions?matchvalue=sample&filtercomponent=resourceName&maxtoreturn=50&format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
			
			.expect('json', 'MapVersionDirectory', {
           	 	complete: "COMPLETE",
           	 	numEntries: 1
         	})
         	.expect('json', 'MapVersionDirectory.entry.?', {
           	 	mapVersionName: "Mapping Sample-1.0",
           	 	documentURI: "urn:oid:mapping:sample",
           	 	about: 'urn:oid:mapping:sample',
           	 	formalName: 'MappingSample',
//            	 	href: baseURL + 'map/Mapping Sample/version/Mapping Sample-1.0'
         	})    
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});

//*********************************************************************
// maps - read map by map id
//*********************************************************************
	it('CTS2 REST call: maps - read map by map id', function (done) {
	  	frisby.get(baseURL + 'map/Mapping Sample?format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
			
			.expect('json', 'MapCatalogEntryMsg.map', {
           	 	mapName: "Mapping Sample",
//            	 	versions: baseURL + 'map/Mapping Sample/versions',
           	 	about: 'urn:oid:mapping:sample',
           	 	entryState: 'ACTIVE'
         	})
         	.expect('json', 'MapCatalogEntryMsg.map.fromCodeSystem', {
           	 	content: 'Automobiles',
         	})  
         	.expect('json', 'MapCatalogEntryMsg.map.toCodeSystem', {
           	 	content: 'GermanMadeParts',
         	})  
         	.expect('json', 'MapCatalogEntryMsg.map.resourceSynopsis', {
           	 	value: 'Mapping Sample',
         	})  
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});

//*********************************************************************
// maps - read map versions of map by map id
//*********************************************************************
	it('CTS2 REST call: maps - read map versions of map by map id', function (done) {
	  	frisby.get(baseURL + 'map/Mapping Sample/versions?format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
			.expect('json', 'MapVersionDirectory', {
           	 	complete: "COMPLETE",
           	 	numEntries: 1
         	})
			.expect('json', 'MapVersionDirectory.entry.?', {
           	 	mapVersionName: "Mapping Sample-1.0",
           	 	documentURI: 'urn:oid:mapping:sample',
           	 	about: 'urn:oid:mapping:sample',
           	 	formalName: 'MappingSample',
//            	 	href: baseURL + 'map/Mapping Sample/version/Mapping Sample-1.0'
         	})
         	.expect('json', 'MapVersionDirectory.entry.*.versionOf', {
           	 	content: "Mapping Sample",
           	 	uri: 'urn:oid:mapping:sample',
//            	 	href: baseURL + 'map/Mapping Sample/version/Mapping Sample'
         	})
         	.expect('json', 'MapVersionDirectory.entry.*.resourceSynopsis', {
           	 	value: "Mapping Sample"
         	})
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});
		
//*********************************************************************
// maps - read spoecific version of a map by map id
//*********************************************************************
	it('CTS2 REST call: maps - read spoecific version of a map by map id', function (done) {
	  	frisby.get(baseURL + 'map/Mapping Sample/version/Mapping Sample-1.0?format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
			.expect('json', 'MapVersionMsg.mapVersion', {
           	 	mapVersionName: "Mapping Sample-1.0",
				documentURI: 'urn:oid:mapping:sample',
				state: "FINAL",
				about: 'urn:oid:mapping:sample',
           	 	formalName: 'MappingSample',
           	 	entryState: "ACTIVE"
         	})
			.expect('json', 'MapVersionMsg.mapVersion.versionOf', {
           	 	content: "Mapping Sample",
           	 	uri: 'urn:oid:mapping:sample',
//            	 	href: baseURL + 'map/Mapping Sample'
         	})
         	.expect('json', 'MapVersionMsg.mapVersion.fromCodeSystemVersion.codeSystem', {
           	 	content: "Automobiles"
         	})
         	.expect('json', 'MapVersionMsg.mapVersion.toCodeSystemVersion.codeSystem', {
           	 	content: "GermanMadeParts"
         	})
         	.expect('json', 'MapVersionMsg.mapVersion.sourceAndNotation', {
           	 	sourceAndNotationDescription: "LexEVS"
         	})
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});

//*********************************************************************
// maps - read entries of a specific version of a map by map id
//*********************************************************************
	it('CTS2 REST call: maps - read entries of a specific version of a map by map id', function (done) {
	  	frisby.get(baseURL + 'map/Mapping Sample/version/Mapping Sample-1.0/entries?format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
			.expect('json', 'MapEntryDirectory', {
           	 	complete: "COMPLETE",
           	 	numEntries: 6
         	})
			.expect('json', 'MapEntryDirectory.entry.?', {
           	 	resourceName: 'Automobiles:Jaguar',
           	 	resourceName: 'Automobiles:A0001',
           	 	resourceName: 'Automobiles:C0001',
           	 	resourceName: 'Automobiles:005',
           	 	resourceName: 'Automobiles:Ford',
           	 	resourceName: 'Automobiles_Different_NS:C0002',
         	})
         	.expect('json', 'MapEntryDirectory.entry.*.map', {
           	 	content: 'Mapping Sample',
// 				href: baseURL + 'map/Mapping Sample'
         	})
         	.expect('json', 'MapEntryDirectory.entry.*.mapFrom', {
           	 	uri: 'urn:oid:11.11.0.1:Jaguar',
           	 	namespace: 'Automobiles',
           	 	name: 'Jaguar',
           	 	
           	 	uri: 'urn:oid:11.11.0.1:A0001',
           	 	namespace: 'Automobiles',
           	 	name: 'A0001',
         	})
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});

//*********************************************************************
// maps - restrict entry of a specific version of a map by map id
//*********************************************************************
	it('CTS2 REST call: maps - restrict entry of a specific version of a map by map id', function (done) {
	  	frisby.get(baseURL + 'map/Mapping Sample/version/Mapping Sample-1.0/entry/Automobiles:Ford?format=json')
	    	.expect('status', 200)
			.expect('header','content-type', 'application/json;charset=UTF-8')
			.expect('json', 'MapEntryMsg.entry', {
           	 	processingRule: "ALL_MATCHES",
           	 	entryState: 'ACTIVE'
         	})
			.expect('json', 'MapEntryMsg.entry.assertedBy.mapVersion', {
           	 	content: "Mapping Sample-1.0",
//            	 	href: baseURL + 'codesystem/Mapping Sample/version/1.0'
         	})
         	.expect('json', 'MapEntryMsg.entry.assertedBy.map', {
           	 	content: "Mapping Sample",
//            	 	href: baseURL + 'map/Mapping Sample'
         	})
         	.expect('json', 'MapEntryMsg.entry.mapFrom', {
           	 	uri: "urn:oid:11.11.0.1:Ford",
           	 	namespace: 'Automobiles',
           	 	name: 'Ford'
         	})
         	.expect('json', 'MapEntryMsg.entry.mapSet.?', {
           	 	processingRule: 'ALL_MATCHES',
           	 	entryOrder: 1           
         	})
            .timeout(60000) //waits 60sec for response
	    	.done(done);
		});
		
});