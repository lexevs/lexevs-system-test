#! /bin/sh

export CATALINA_OPTS="$CATALINA_OPTS -Xms128m"
export CATALINA_OPTS="$CATALINA_OPTS -Xmx3024m"

export CATALINA_OPTS="$CATALINA_OPTS -Dorg.LexGrid.LexBIG.caCore.Properties=/lexevs.properties"