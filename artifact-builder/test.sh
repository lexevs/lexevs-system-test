BUILDDIR='/build'

mkdir $BUILDDIR && cd $BUILDDIR

# LexEVS
git clone -b bugfix/LEXEVS-1847 https://github.com/kevinpeterson/lexevs.git && \
    cd lexevs && \
    ant

cp -f /lbconfig.props /build/lexevs/lbPackager/antbuild/resources/config

cp /mysql-connector-java-5.1.37.jar /build/lexevs/lbPackager/antbuild/runtime/sqlDrivers

cp -r /build/lexevs/lbPackager/antbuild/* /lexevs/

cp -f /lbconfig.props /lexevs/resources/config/

cp /mysql-connector-java-5.1.37.jar /lexevs/runtime/sqlDrivers

# LexEVS Remote
cd $BUILDDIR
git clone -b bugfix/LEXEVS-1847 https://github.com/kevinpeterson/lexevs-remote.git && \
    cd lexevs-remote/LexEVSService && \
    cp /lexevs/runtime-components/lexbig.jar system/lib/ && \
    cp /lexevs/test/lbTest.jar test/lib/ && \
    ant && \
    mv output/lexevsapi64/package/webapp/lexevsapi64.tomcat.war /artifacts/lexevsapi64.war && \
    cp -r ../* /lexevs-remote/

# URI Resolver
cd $BUILDDIR
git clone --depth 1 https://github.com/cts2/URI_Resolver.git && \
    cd URI_Resolver && \
    git checkout tags/v1.0.0.FINAL && \
    mvn clean install && \
    mv target/*.war /artifacts/uriresolver.war && \
    mkdir /results/uriresolver && \
    cp -R target/surefire-reports/* /results/uriresolver/