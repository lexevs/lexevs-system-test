#!/bin/bash

if [ ! -f ${CATALINA_HOME}/scripts/.tomcat_admin_created ]; then
	${CATALINA_HOME}/scripts/create_admin_user.sh
fi

cp /artifacts/uriresolver.war /opt/tomcat/webapps/

catalina.sh run