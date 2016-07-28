# Get the base image to Ubuntu
FROM centos:7

RUN yum update && yum clean

RUN yum install -y git

RUN yum install -y maven

RUN yum install -q -y openjdk-7-jre-headless openjdk-7-jdk && yum clean

ENV JAVA_HOME /usr/lib/jvm/java-7-openjdk-amd64/
ENV PATH $JAVA_HOME/bin:$PATH

ENV MAVEN_OPTS -Xmx1000m -XX:PermSize=256m

ENV JAVA_TOOL_OPTIONS -Dfile.encoding=UTF8

ADD test.sh /

CMD sh /test.sh