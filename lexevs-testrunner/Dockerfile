FROM java:openjdk-8-jdk

# TEMPORARY FIX FOR NCI DOWNLOAD ISSUE!
ADD apache-ant-1.9.3-bin.tar.gz /

RUN cd / && \
# TEMPORARALILY ADDED IT MANUALLY.
#    wget http://archive.apache.org/dist/ant/binaries/apache-ant-1.9.3-bin.tar.gz && \
#    tar xvfvz apache-ant-1.9.3-bin.tar.gz && \
    mv apache-ant-1.9.3 /opt/ant && \
    sh -c 'echo ANT_HOME=/opt/ant >> /etc/environment' && \
    ln -s /opt/ant/bin/ant /usr/bin/ant

ADD test.sh /

ADD lbconfig.props /

ADD test.properties /

CMD sh /test.sh