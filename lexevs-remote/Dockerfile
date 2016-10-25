# Get the base image to Ubuntu
FROM tomcat:7.0.67-jre8

VOLUME /artifacts

RUN apt-get update && apt-get clean

RUN apt-get install -y openjdk-8-jre-headless openjdk-8-jdk

ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/
ENV PATH $JAVA_HOME/bin:$PATH

ENV JAVA_TOOL_OPTIONS -Dfile.encoding=UTF8

RUN apt-get install -y git

ADD lexevs.properties /

ADD setenv.sh /usr/local/tomcat/bin/

ADD run.sh /

CMD sh /run.sh
