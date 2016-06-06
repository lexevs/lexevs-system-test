# Get the base image to Ubuntu
FROM ubuntu:14.04

RUN apt-get update && apt-get clean

RUN apt-get install -q -y openjdk-7-jre-headless openjdk-7-jdk && apt-get clean

ENV JAVA_HOME /usr/lib/jvm/java-7-openjdk-amd64/
ENV PATH $JAVA_HOME/bin:$PATH

ADD run.sh /

CMD sh /run.sh