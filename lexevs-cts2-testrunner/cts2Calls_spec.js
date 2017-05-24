// Uses frisby.js REST API testing framework - http://frisbyjs.com/
//
// Example call to this file passing in the base CTS2 URL and creating a junit report:
// jasmine-node --config baseURL http://localhost:8181/cts2/ cts2Calls_spec.js --junitreport
//
// Requirements:  These tests are writtent to be used as part of the 
// lexevs-system-tests suite: https://github.com/lexevs/lexevs-system-test
// using the content that is loaded during the lexevs-load.

var frisby = require('frisby');
var cts2Version = '1.3.3.FINAL';

// Get the parameter passed in from the command line
//var baseURL = 'http://localhost:8181/cts2/';
var baseURL = process.env['baseURL'];
console.log("Working with CTS2 baseURL:" + baseURL);

//*********************************************************************
// service
//*********************************************************************
frisby.create('CTS2 REST call: service')
  .get(baseURL + 'service?format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .expectBodyContains(cts2Version)
  .expectJSONLength('BaseService.supportedProfile',14)
  .expectJSON('BaseService.supportedProfile.?', {
    structuralProfile:"SP_VALUE_SET_DEFINITION",
    structuralProfile:"SP_VALUE_SET",
    structuralProfile:"SP_MAP_VERSION"
   })
 .toss();

//*********************************************************************
// Count entities
//*********************************************************************
frisby.create('CTS2 REST call: entities count')
  .head(baseURL + 'entities')
  .expectStatus(200)
  //.inspectHeaders()
 .toss();

//*********************************************************************
// entities - search (all)
//*********************************************************************
frisby.create('CTS2 REST call: entities search (all)')
  .get(baseURL + 'entities?maxtoreturn=50&format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .expectJSONLength('EntityDirectory.entry',50)
 .toss();

//*********************************************************************
// entities search for automobile
//*********************************************************************
frisby.create('CTS2 REST call: entities search for automobile')
  .get(baseURL + 'entities?matchvalue=automobile&filtercomponent=resourceSynopsis&matchalgorithm=luceneQuery&maxtoreturn=50&format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .expectBodyContains('Automobiles-1.0')
  .expectJSONLength('EntityDirectory.entry',1)
  .expectBodyContains('Automobiles')
  .expectBodyContains('A0001')
  .toss();

//*********************************************************************
// entities read by URI  // not working with the redirect
//*********************************************************************
//frisby.create('CTS2 REST call: read entity by URI')
//  .get(baseURL + 'entitybyuri?uri=Automobiles:VD005&format=json')
//  .expectStatus(301)
//  .expectHeaderContains('content-type', 'charset=utf-8')
//  .expectBodyContains('Automobiles-1.0')
//  .expectJSONLength('entityDescription',1)
//  .expectBodyContains('Automobiles')
//  .expectBodyContains('VD005')
//  .toss();

//*********************************************************************
// entities read 
//*********************************************************************
frisby.create('CTS2 REST call: read entity')
  .get(baseURL + 'codesystem/Automobiles/version/1.0/entity/VD005?format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .expectBodyContains('Automobiles-1.0')
  .expectJSONLength('EntityDescriptionMsg.entityDescription',1)
  .expectBodyContains('Automobiles')
  .expectBodyContains('VD005')
  .toss();


//*********************************************************************
// entities read by ID  // not working with the redirect
//*********************************************************************
//frisby.create('CTS2 REST call: read entity by ID')
//  .get(baseURL + 'entity/Automobiles:VD005?format=json')
//  .expectStatus(200)
//  .expectHeaderContains('content-type', 'charset=utf-8')
//  .expectBodyContains('Automobiles-1.0')
//  .expectJSONLength('EntityDescriptionMsg.entityDescription',1)
//  .expectBodyContains('Automobiles')
//  .expectBodyContains('VD005')
//  .toss();


//*********************************************************************
// codesystemversions - search all
//*********************************************************************
frisby.create('CTS2 REST call: codesystemversions - search all')
  .get(baseURL + 'codesystemversions?format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .expectBodyContains('Automobiles-1.0')
  .expectJSONLength('CodeSystemVersionCatalogEntryDirectory.entry',8)
  .expectJSON('CodeSystemVersionCatalogEntryDirectory.entry.?', {
     codeSystemVersionName:"Automobiles-1.0",
     documentURI:"urn:oid:11.11.0.1:1.0"
   })
 .toss();

//*********************************************************************
// codesystemversions - search automobile
//*********************************************************************
frisby.create('CTS2 REST call: codesystemversions - search automobile')
  .get(baseURL + 'codesystemversions?matchvalue=automobile&filtercomponent=resourceSynopsis&format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .expectJSONLength('CodeSystemVersionCatalogEntryDirectory.entry',2)
  .expectJSON('CodeSystemVersionCatalogEntryDirectory.entry.?', {
     codeSystemVersionName:"Automobiles-1.0",
     documentURI:"urn:oid:11.11.0.1:1.0"
   })
  .expectJSON('CodeSystemVersionCatalogEntryDirectory.entry.?', {
     codeSystemVersionName:"Automobiles_extension-1.0[:]extension",
     documentURI:"urn:oid:11.11.0.1.1-extension:1.0-extension"
   })
 .toss();

//*********************************************************************
// codesystemversions - exact search Automobiles-1.0
//*********************************************************************
frisby.create('CTS2 REST call: codesystemversions - exact search Automobiles-1.0')
  .get(baseURL + 'codesystemversions?matchvalue=Automobiles-1.0&filtercomponent=resourceName&matchalgorithm=exactMatch&format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .expectJSONLength('CodeSystemVersionCatalogEntryDirectory.entry',1)
  .expectJSON('CodeSystemVersionCatalogEntryDirectory.entry.?', {
     codeSystemVersionName:"Automobiles-1.0",
     documentURI:"urn:oid:11.11.0.1:1.0"
   })
 .toss();

//*********************************************************************
// codesystemversion - read by version ID
//*********************************************************************
frisby.create('CTS2 REST call: codesystem - read by version ID')
  .get(baseURL + 'codesystem/Automobiles/version/1.0?format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .expectBodyContains('Automobiles-1.0')
  .expectJSON('CodeSystemVersionCatalogEntryMsg.codeSystemVersionCatalogEntry', {
     formalName:"autos",
     officialResourceVersionId:"1.0"
   })
  .toss();

//*********************************************************************
// codesystemversion - search entities
//*********************************************************************
frisby.create('CTS2 REST call: codesystem - search entities')
  .get(baseURL + 'codesystem/Automobiles/version/1.0/entities?format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  //.expectJSONLength('EntityDirectory.entry',22)
  .expectBodyContains('Automobiles-1.0')
  .expectBodyContains('Automobile')
  .expectBodyContains('A0001')
  .expectJSON('EntityDirectory.entry.?', {
     about:"urn:oid:11.11.0.1:A0001",
   })
  .expectJSON('EntityDirectory.entry.?', {
     about:"urn:oid:11.11.0.1:Chevy",
   })
  .toss();

//*********************************************************************
// codesystemversion - read an entity by id
//*********************************************************************
frisby.create('CTS2 REST call: codesystem - read an entity by id')
  .get(baseURL + 'codesystem/Automobiles/version/1.0/entity/A0001?format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type','charset=utf-8')
  .expectJSON('EntityDescriptionMsg.entityDescription.namedEntity', {
      entryState:'ACTIVE',
      about:'urn:oid:11.11.0.1:A0001'
   })
  .expectJSON('EntityDescriptionMsg.entityDescription.namedEntity.designation.?', {
      designationRole:'PREFERRED',
      value:'Automobile'
   })
  .toss();

//*********************************************************************
// associations - get children
//*********************************************************************
frisby.create('CTS2 REST call: associations - get children')
  .get(baseURL + 'codesystem/Automobiles/version/1.0/entity/C0001/children?format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .expectJSON('EntityDirectory', {
      complete:'COMPLETE',
      numEntries:1
   })
  .expectBodyContains('C0011(5564)')
  .expectBodyContains('Car With Trailer')
  .toss();


//*********************************************************************
// associations - subjectof
//*********************************************************************
frisby.create('CTS2 REST call:  associations - subjectof')
  .get(baseURL + 'codesystem/Automobiles/version/1.0/entity/C0001/subjectof?format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .expectJSON('AssociationDirectory', {
      complete:'COMPLETE',
      numEntries:1
   })
  .expectBodyContains('C0011(5564)')
  .toss();

//*********************************************************************
// associations - targetof
//*********************************************************************
frisby.create('CTS2 REST call: associations - targetof')
  .get(baseURL + 'codesystem/Automobiles/version/1.0/entity/C0001/targetof?format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .expectJSON('AssociationDirectory', {
      complete:'COMPLETE',
      numEntries:1
   })
  .expectBodyContains('A0001')
  .toss();

//*********************************************************************
// valuesets - search (all)
//*********************************************************************
frisby.create('CTS2 REST call: valuesets - search (all)')
  .get(baseURL + 'valuesets?format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .toss();

//*********************************************************************
// valuesets - search (Auto)
//*********************************************************************
frisby.create('CTS2 REST call: valuesets - search (Auto)')
  .get(baseURL + 'valuesets?matchvalue=Autos&filtercomponent=resourceName&maxtoreturn=50&matchalgorithm=contains&format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .expectJSON('ValueSetCatalogEntryDirectory.entry.?', {
      valueSetName:'All Domestic Autos AND GM'
   })
  .expectJSON('ValueSetCatalogEntryDirectory.entry.?', {
      valueSetName:'All Domestic Autos AND GM1'
   })
  .toss();


//*********************************************************************
// valuesets - read a valueset
//*********************************************************************
frisby.create('CTS2 REST call: valuesets - read a valueset')
  .get(baseURL + 'valueset/All Domestic Autos AND GM?format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .expectJSON('ValueSetCatalogEntryMsg.valueSetCatalogEntry', {
      valueSetName:'All Domestic Autos AND GM',
      entryState:'ACTIVE'
   })
  .toss();

//*********************************************************************
// valuesets - resolve a valueset definition by id
//*********************************************************************
frisby.create('CTS2 REST call: valuesets - resolve a valueset definition by id')
  .get(baseURL + 'valueset/All Domestic Autos But GM/definition/13ff5406?format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .expectJSON('ValueSetDefinitionMsg.valueSetDefinition', {
      about:'SRITEST:AUTO:AllDomesticButGM',
      formalName: 'SRITEST:AUTO:AllDomesticButGM',
      entryState:'ACTIVE'
   })
  .toss();

//*********************************************************************
// valuesets - search all pre-resolved value set definitions
//*********************************************************************
frisby.create('CTS2 REST call: valuesets - search all pre-resolved value set definitions')
  .get(baseURL + 'resolvedvaluesets?format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .expectBodyContains('SRITEST:AUTO:AllDomesticButGM')
  .toss();

//*********************************************************************
// maps - search map version summaries (empty search)
//*********************************************************************
frisby.create('CTS2 REST call: maps - search map version summaries (empty search)')
  .get(baseURL + 'mapversions?format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .expectJSON('MapVersionDirectory.entry.?', {
      mapVersionName:'Mapping Sample-1.0'
   })
  .toss();

//*********************************************************************
// maps - search map version summaries (with search criteria)
//*********************************************************************
frisby.create('CTS2 REST call: maps - search map version summaries (with search criteria)')
  .get(baseURL + 'mapversions?matchvalue=sample&filtercomponent=resourceName&maxtoreturn=50&format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .expectJSON('MapVersionDirectory.entry.?', {
      mapVersionName:'Mapping Sample-1.0'
   })
  .expectJSON('MapVersionDirectory', {
      numEntries:1
   })
  .toss();

//*********************************************************************
// maps - read map by map id
//*********************************************************************
frisby.create('CTS2 REST call: maps - read map by map id')
  .get(baseURL + 'map/Mapping Sample?format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .expectJSON('MapCatalogEntryMsg.map', {
      mapName:'Mapping Sample',
      about: 'urn:oid:mapping:sample',
      formalName: 'MappingSample',
      entryState: 'ACTIVE'
   })
  .toss();

//*********************************************************************
// maps - read map versions of map by map id
//*********************************************************************
frisby.create('CTS2 REST call: maps - read map versions of map by map id')
  .get(baseURL + 'map/Mapping Sample/versions?format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .expectJSON('MapVersionDirectory.entry.?', {
      mapVersionName: 'Mapping Sample-1.0',
      about: 'urn:oid:mapping:sample',
      formalName: 'MappingSample',
      documentURI: 'urn:oid:mapping:sample'
   })
  .toss();

//*********************************************************************
// maps - read spoecific version of a map by map id
//*********************************************************************
frisby.create('CTS2 REST call: maps - read spoecific version of a map by map id')
  .get(baseURL + 'map/Mapping Sample/version/Mapping Sample-1.0?format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .expectJSON('MapVersionMsg.mapVersion', {
      mapVersionName: 'Mapping Sample-1.0'
   })
  .toss();

//*********************************************************************
// maps - read entries of a specific version of a map by map id
//*********************************************************************
frisby.create('CTS2 REST call: maps - read entries of a specific version of a map by map id')
  .get(baseURL + 'map/Mapping Sample/version/Mapping Sample-1.0/entries?format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .expectBodyContains('Jaguar')
  .expectBodyContains('A0001')
  .expectBodyContains('C0001')
  .expectBodyContains('005')
  .expectBodyContains('Ford')
  .expectBodyContains('C0002')
  .expectJSON('MapEntryDirectory', {
      numEntries:6,
      complete: 'COMPLETE'
   })
  .toss();

//*********************************************************************
// maps - restrict entry of a specific version of a map by map id
//*********************************************************************
frisby.create('CTS2 REST call: maps - restrict entry of a specific version of a map by map id')
  .get(baseURL + 'map/Mapping Sample/version/Mapping Sample-1.0/entry/Automobiles:Ford?format=json')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'charset=utf-8')
  .expectJSON('MapEntryMsg.entry.assertedBy.mapVersion', {
      content: 'Mapping Sample-1.0'
   })
  .expectJSON('MapEntryMsg.entry.assertedBy.map', {
      content: 'Mapping Sample'
   })
  .expectJSON('MapEntryMsg.entry.mapFrom', {
     uri: 'urn:oid:11.11.0.1:Ford',
     namespace: 'Automobiles',
     name: 'Ford'
   })
  .toss();