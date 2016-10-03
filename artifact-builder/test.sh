BUILDDIR='/build'

mkdir $BUILDDIR && cd $BUILDDIR

export MAVEN_OPTS="-Dhttps.protocols=TLSv1.1,TLSv1.2 -Dforce.http.jre.executor=true -Xmx3072m -XX:MaxPermSize=752m"
export ANT_OPTS="-Dhttps.protocols=TLSv1.1,TLSv1.2 -Dforce.http.jre.executor=true -Xmx3072m -XX:MaxPermSize=752m"

# LexEVS
git clone -b $LEXEVS_BRANCH $LEXEVS_REPO && \
    cd lexevs && \
    ant

yes | cp -f /lbconfig.props /build/lexevs/lbPackager/antbuild/resources/config

yes | cp /mysql-connector-java-5.1.37.jar /build/lexevs/lbPackager/antbuild/runtime/sqlDrivers

yes | cp -r /build/lexevs/lbPackager/antbuild/* /lexevs/

yes | cp -f /lbconfig.props /lexevs/resources/config/

yes | cp /mysql-connector-java-5.1.37.jar /lexevs/runtime/sqlDrivers

# LexEVS Remote
cd $BUILDDIR
git clone -b $LEXEVS_REMOTE_BRANCH $LEXEVS_REMOTE_REPO && \
    cd lexevs-remote/LexEVSService && \
    cp /lexevs/runtime-components/lexbig.jar system/lib/ && \
    cp /lexevs/test/lbTest.jar test/lib/ && \
    ant && \
    mv output/lexevsapi64/package/webapp/*.tomcat.war /artifacts/lexevsapi64.war && \
    cp -r ../* /lexevs-remote/

# URI Resolver
cd $BUILDDIR
git clone --depth 1 $URI_RESOLVER_REPO && \
    cd URI_Resolver && \
    git checkout $URI_RESOLVER_TAG && \
    mvn clean install && \
    mv target/*.war /artifacts/uriresolver.war && \
    mkdir /results/uriresolver && \
    cp -R target/surefire-reports/* /results/uriresolver/