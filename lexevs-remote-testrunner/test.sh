mv /Test.properties /lexevs-remote/LexEVSService/test/resources

cd /lexevs-remote/LexEVSService/test

ant

mkdir /results/remote-api/

cp -R reports/* /results/remote-api/