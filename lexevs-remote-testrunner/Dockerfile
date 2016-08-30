FROM centos7-java8

RUN yum install -y ant-junit

ADD test.sh /

ADD Test.properties /

CMD sh /test.sh