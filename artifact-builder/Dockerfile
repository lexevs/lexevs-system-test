# Get the base image to Ubuntu
FROM ubuntu:16.04

RUN apt-get update && apt-get clean

RUN apt-get install -y wget

RUN apt-get install -y git

RUN cd / && \
    wget http://archive.apache.org/dist/ant/binaries/apache-ant-1.9.3-bin.tar.gz && \
    tar xvfvz apache-ant-1.9.3-bin.tar.gz && \
    mv apache-ant-1.9.3 /opt/ant && \
    sh -c 'echo ANT_HOME=/opt/ant >> /etc/environment' && \
    ln -s /opt/ant/bin/ant /usr/bin/ant

RUN apt-get install -y maven

RUN apt-get install -q -y openjdk-8-jre-headless openjdk-8-jdk && apt-get clean

ENV ANT_HOME=/opt/ant

ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/

ENV PATH $JAVA_HOME/bin:$PATH

ENV JAVA_TOOL_OPTIONS -Dfile.encoding=UTF8

RUN wget http://central.maven.org/maven2/mysql/mysql-connector-java/5.1.37/mysql-connector-java-5.1.37.jar -P /

ADD lbconfig.props /

ADD test.sh /
#RUN ["chmod", "+x", "/test.sh"]

#CMD sh /test.sh
CMD bash /test.sh