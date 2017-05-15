jasmine-node --config baseURL http://lexevs-cts2:8080/lexevscts2/ cts2Calls_spec.js --junitreport

cp -R reports/* results/cts2-rest/
