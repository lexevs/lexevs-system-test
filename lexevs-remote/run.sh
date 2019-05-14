echo "START copying war to webapps"
cp /lexevsapi65.war /local/content/tomcat/container/webapps/
echo "DONE copying war to webapps"

cd /usr/local/tomcat8.5/bin/
./catalina.sh run

echo "after staring tomcat"