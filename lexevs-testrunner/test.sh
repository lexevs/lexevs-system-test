mkdir /test
mkdir /results/lexevs/

cp -r /lexevs/* /test/

cp -f /lbconfig.props /test/resources/config/

cp -f /test.properties /test/test/resources/testData/

 cd /test/test && \
    chmod 777 * && \
    sh TestRunner.sh -x

cp -R report.* /results/lexevs/

#tail -f /lbconfig.props
