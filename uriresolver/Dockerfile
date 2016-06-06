# Get the base image to Ubuntu
FROM tomcat:7.0.65-jre7

RUN apt-get update && apt-get install -y git maven openjdk-7-jdk

ADD uriresolver.properties /root/.cts2_uri/

ADD run.sh /

CMD sh /run.sh
