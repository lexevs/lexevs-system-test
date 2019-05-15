# Get the base image from NCI. CentOS7 with Tomcat 8.5
FROM ncidockerhub.nci.nih.gov/cbiit/centos7_tomcat85

USER tomcata

ENV PATH $JAVA_HOME/bin:$PATH
ENV JAVA_TOOL_OPTIONS -Dfile.encoding=UTF8
ENV CATALINA_OPTS $CATALINA_OPTS -Dorg.LexGrid.LexBIG.caCore.Properties=/home/tomcata/lexevs.properties

ADD --chown=tomcata lexevs.properties /home/tomcata/

ADD --chown=tomcata setenv.sh /local/content/tomcat/container/bin/
RUN chmod 755 /local/content/tomcat/container/bin/setenv.sh

ADD --chown=tomcata wait-for-it.sh /
RUN chmod 755 /wait-for-it.sh 

ADD ./artifacts/lexevsapi65.war /

ADD --chown=tomcata run.sh /
RUN chmod 755 /run.sh 

# Wait for the DB to be started before running.
ENTRYPOINT /wait-for-it.sh mysql:3306 -t 30 && /run.sh 

#ADD ./artifacts/lexevsapi65.war /local/content/tomcat/container/webapps/
#ENTRYPOINT ["/usr/bin/sh", "/run.sh"]   // without the wait - works