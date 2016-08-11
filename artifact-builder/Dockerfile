FROM lexevssystemtest_centos7-java8

RUN wget http://central.maven.org/maven2/mysql/mysql-connector-java/5.1.37/mysql-connector-java-5.1.37.jar -P /

ADD lbconfig.props /

ADD test.sh /

CMD sh /test.sh