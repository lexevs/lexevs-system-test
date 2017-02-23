# Get the base image to Ubuntu
FROM tomcat:8.5.11-jre8

RUN apt-get update && apt-get install -y git maven openjdk-8-jdk

ADD uriresolver.properties /root/.cts2_uri/

ADD run.sh /

CMD sh /run.sh
