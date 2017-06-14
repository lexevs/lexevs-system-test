# Get the base image to Ubuntu
FROM ncidockerhub.nci.nih.gov/lexevs/nci-tomcat:8.5.15-jre8

ADD setenv.sh /usr/local/tomcat/bin/

ADD config/* /root/.cts2/lexevscts2/config/

ADD run.sh /

CMD sh /run.sh
