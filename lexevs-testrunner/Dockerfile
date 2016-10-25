FROM java:openjdk-8-jdk

RUN cd / && \
    wget http://archive.apache.org/dist/ant/binaries/apache-ant-1.8.4-bin.tar.gz && \
    tar xvfvz apache-ant-1.8.4-bin.tar.gz && \
    mv apache-ant-1.8.4 /opt/ant && \
    sh -c 'echo ANT_HOME=/opt/ant >> /etc/environment' && \
    ln -s /opt/ant/bin/ant /usr/bin/ant

ADD test.sh /

ADD lbconfig.props /

CMD sh /test.sh