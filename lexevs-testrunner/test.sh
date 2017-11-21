mkdir /test
mkdir /results/lexevs/

cp -r /lexevs/* /test/

cp -f /lbconfig.props /test/resources/config/

#cd /test/test && \
#   chmod 777 * && \
#   sh TestRunner.sh -x

cp -R report.* /results/lexevs/