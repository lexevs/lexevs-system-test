#wait 150 seconds... time to let the lexevs-cts2 container to start up.
echo Sleeping 150 seconds to let the lexevs-cts2 container to start up.
sleep 150

jasmine-node --config baseURL http://lexevs-cts2:8080/lexevscts2/ cts2Calls_spec.js --junitreport

mkdir /results/lexevs-cts2-rest/
cp -R reports/* /results/lexevs-cts2-rest/
