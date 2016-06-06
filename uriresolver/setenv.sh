#! /bin/sh

export CATALINA_OPTS="$CATALINA_OPTS -Xms64m"
export CATALINA_OPTS="$CATALINA_OPTS -Xmx512m"

export CATALINA_OPTS="$CATALINA_OPTS -XX:MaxPermSize=256m"

export CATALINA_OPTS="$CATALINA_OPTS -Dorg.LexGrid.LexBIG.caCore.Properties=/lexevs.properties"