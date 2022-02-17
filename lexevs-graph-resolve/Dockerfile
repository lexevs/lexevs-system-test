# Get the base image from NCI. CentOS7 with Tomcat 8.5
FROM ncidockerhub.nci.nih.gov/cbiit/centos7_tomcat85

USER root

# Pass in password for graph db.
ENV JAVA_OPTS=-Dpwd=lexgrid

ADD ./artifacts/graph-resolve.war /local/content/tomcat/container/webapps
