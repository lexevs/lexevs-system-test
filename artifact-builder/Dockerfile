# Get the base image to CentOS
FROM centos:7

RUN yum install -y wget

RUN yum install -y git

RUN cd / && \
    wget http://archive.apache.org/dist/ant/binaries/apache-ant-1.9.2-bin.tar.gz && \
    tar xvfvz apache-ant-1.9.2-bin.tar.gz && \
    mv apache-ant-1.9.2 /opt/ant && \
    sh -c 'echo ANT_HOME=/opt/ant >> /etc/environment' && \
    ln -s /opt/ant/bin/ant /usr/bin/ant

RUN yum install -y maven

RUN wget --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/8u92-b14/jdk-8u92-linux-x64.rpm

RUN yum install -y ./jdk-8u92-linux-x64.rpm

RUN alternatives --install /usr/bin/java jar /usr/java/latest/bin/java 200000
RUN alternatives --install /usr/bin/javaws javaws /usr/java/latest/bin/javaws 200000
RUN alternatives --install /usr/bin/javac javac /usr/java/latest/bin/javac 200000

ENV JAVA_HOME /usr/java/latest

ENV PATH $JAVA_HOME/bin:$PATH

ENV JAVA_TOOL_OPTIONS -Dfile.encoding=UTF8

RUN wget http://central.maven.org/maven2/mysql/mysql-connector-java/5.1.37/mysql-connector-java-5.1.37.jar -P /

ADD lbconfig.props /

ADD test.sh /

CMD sh /test.sh