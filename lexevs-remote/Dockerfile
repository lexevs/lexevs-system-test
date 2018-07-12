# Get the base image from NCI. CentOS7 with Tomcat 8.5
FROM ncidockerhub.nci.nih.gov/cbiit/centos7_tomcat85

USER root

ENV PATH $JAVA_HOME/bin:$PATH
ENV JAVA_TOOL_OPTIONS -Dfile.encoding=UTF8
ENV CATALINA_OPTS $CATALINA_OPTS -Dorg.LexGrid.LexBIG.caCore.Properties=/home/tomcata/lexevs.properties

ADD --chown=tomcata lexevs.properties /home/tomcata/

ADD --chown=tomcata setenv.sh /local/content/tomcat/container/bin/
RUN chmod 755 /local/content/tomcat/container/bin/setenv.sh

ADD ./artifacts/lexevsapi65.war /local/content/tomcat/container/webapps/
