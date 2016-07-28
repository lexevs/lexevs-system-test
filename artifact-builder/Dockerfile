# Get the base image to Ubuntu
FROM centos:7

RUN yum update && yum clean

RUN yum install -y wget

RUN yum install -y git

RUN cd / && \
    wget http://archive.apache.org/dist/ant/binaries/apache-ant-1.8.4-bin.tar.gz && \
    tar xvfvz apache-ant-1.8.4-bin.tar.gz && \
    mv apache-ant-1.8.4 /opt/ant && \
    sh -c 'echo ANT_HOME=/opt/ant >> /etc/environment' && \
    ln -s /opt/ant/bin/ant /usr/bin/ant

RUN yum install -y maven

RUN yum install -q -y openjdk-7-jre-headless openjdk-7-jdk && yum clean

ENV JAVA_HOME /usr/lib/jvm/java-7-openjdk-amd64/
ENV PATH $JAVA_HOME/bin:$PATH

ENV JAVA_TOOL_OPTIONS -Dfile.encoding=UTF8

RUN wget http://central.maven.org/maven2/mysql/mysql-connector-java/5.1.37/mysql-connector-java-5.1.37.jar -P /

ADD lbconfig.props /

ADD test.sh /

CMD sh /test.sh