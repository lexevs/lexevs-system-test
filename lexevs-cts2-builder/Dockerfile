# Get the base image to Ubuntu
FROM centos:7

RUN yum -y update && yum clean all

RUN yum install -y wget

RUN yum install -y git

RUN yum install -y maven

RUN wget --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/8u92-b14/jdk-8u92-linux-x64.rpm

RUN yum install -y ./jdk-8u92-linux-x64.rpm

RUN alternatives --install /usr/bin/java jar /usr/java/latest/bin/java 200000
RUN alternatives --install /usr/bin/javaws javaws /usr/java/latest/bin/javaws 200000
RUN alternatives --install /usr/bin/javac javac /usr/java/latest/bin/javac 200000

ENV JAVA_HOME /usr/java/latest

ENV PATH $JAVA_HOME/bin:$PATH

ENV MAVEN_OPTS -Xmx1000m -XX:PermSize=256m

ENV JAVA_TOOL_OPTIONS -Dfile.encoding=UTF8

ADD test.sh /

CMD sh /test.sh