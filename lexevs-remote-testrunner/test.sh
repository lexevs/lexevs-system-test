mv /Test.properties /lexevs-remote/LexEVSService/test/resources

cd /lexevs-remote/LexEVSService/test

export ANT_OPTS="-Dhttps.protocols=TLSv1.1,TLSv1.2 -Dforce.http.jre.executor=true -Xmx3072m -XX:MaxPermSize=752m"

ant

mkdir /results/remote-api/

cp -R reports/* /results/remote-api/