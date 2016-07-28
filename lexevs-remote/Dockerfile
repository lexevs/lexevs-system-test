# Get the base image to Ubuntu
FROM tomcat:7.0.65-jre7

VOLUME /artifacts

RUN yum update && yum clean

RUN yum install -y openjdk-7-jre-headless openjdk-7-jdk

ENV JAVA_HOME /usr/lib/jvm/java-7-openjdk-amd64/
ENV PATH $JAVA_HOME/bin:$PATH

ENV JAVA_TOOL_OPTIONS -Dfile.encoding=UTF8

RUN yum install -y git

ADD lexevs.properties /

ADD setenv.sh /usr/local/tomcat/bin/

ADD run.sh /

CMD sh /run.sh
