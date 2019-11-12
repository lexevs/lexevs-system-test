jasmine-node --config baseURL http://graph-resolve:8080/graph-resolve/ graph-resolveCalls_spec.js --junitreport

mkdir /results/lexevs-graph-resolve/
cp -R reports/* /results/lexevs-graph-resolve/

#tail -f test.sh