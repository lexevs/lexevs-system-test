FROM centos:7

RUN yum -y update && yum clean all

RUN yum install -y wget

RUN wget --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/8u92-b14/jdk-8u92-linux-x64.rpm

RUN yum install -y ./jdk-8u92-linux-x64.rpm

RUN alternatives --install /usr/bin/java jar /usr/java/latest/bin/java 200000
RUN alternatives --install /usr/bin/javaws javaws /usr/java/latest/bin/javaws 200000
RUN alternatives --install /usr/bin/javac javac /usr/java/latest/bin/javac 200000

ENV JAVA_HOME /usr/java/latest

RUN cd / && \
    wget http://archive.apache.org/dist/ant/binaries/apache-ant-1.9.2-bin.tar.gz && \
    tar xvfvz apache-ant-1.9.2-bin.tar.gz && \
    mv apache-ant-1.9.2 /opt/ant && \
    sh -c 'echo ANT_HOME=/opt/ant >> /etc/environment' && \
    ln -s /opt/ant/bin/ant /usr/bin/ant

ADD test.sh /

ADD lbconfig.props /

CMD sh /test.sh