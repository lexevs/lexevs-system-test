# Get the base image to Ubuntu
FROM tomcat:7.0.67-jre8

ADD setenv.sh /usr/local/tomcat/bin/

ADD config/* /root/.cts2/lexevscts2/config/

ADD run.sh /

CMD sh /run.sh
