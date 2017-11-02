# Get the base image from NCI. CentOS7 with Tomcat 8.5
FROM ncidockerhub.nci.nih.gov/cbiit/centos7_tomcat85

ADD uriresolver.properties /home/tomcata/.cts2_uri/

# these commands work on docker 17.09
ADD --chown=tomcata run.sh /home/tomcata/
RUN chmod 755 /home/tomcata/run.sh

#VOLUME /artifacts
#ADD /artifacts/uriresolver.war /local/content/tomcat/container/webapps

ADD artifacts/uriresolver.war /local/content/tomcat/container/webapps
