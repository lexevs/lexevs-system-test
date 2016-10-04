yes | mv /Test.properties /lexevs-remote/LexEVSService/test/resources

yes | rm /usr/share/java/junit.jar

yes | rm /usr/share/java/junit4.jar

cd /lexevs-remote/LexEVSService/test

export ANT_OPTS="-Dhttps.protocols=TLSv1.1,TLSv1.2 -Dforce.http.jre.executor=true -Xmx3072m -XX:MaxPermSize=752m"

ant

mkdir /results/remote-api/

yes | cp -R reports/* /results/remote-api/