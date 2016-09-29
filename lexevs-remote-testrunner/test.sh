yes | mv /Test.properties /lexevs-remote/LexEVSService/test/resources

yes | rm /usr/share/java/junit.jar

yes | rm /usr/share/java/junit4.jar

cd /lexevs-remote/LexEVSService/test

ant

mkdir /results/remote-api/

yes | cp -R reports/* /results/remote-api/