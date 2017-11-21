# Get the base image from NCI. CentOS7 with Tomcat 8.5
FROM ncidockerhub.nci.nih.gov/cbiit/centos7_tomcat85

#VOLUME /artifacts

USER root

ADD --chown=tomcata setenv.sh /home/tomcata/
ADD --chown=tomcata config/* /home/tomcata/.cts2/lexevscts2/config/

RUN chmod -R 777 /home/tomcata/.cts2/

ADD --chown=tomcata artifacts/lexevscts2.war /local/content/tomcat/container/webapps

RUN chmod -R 777 /local/content/tomcat/container/webapps
