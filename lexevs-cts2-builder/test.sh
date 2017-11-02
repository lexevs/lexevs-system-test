BUILDDIR='/build'

mkdir $BUILDDIR && cd $BUILDDIR

export MAVEN_OPTS="-Dhttps.protocols=TLSv1.1,TLSv1.2 -Dforce.http.jre.executor=true -Xmx3072m -XX:MaxPermSize=752m"

# LexEVS CTS2
cd $BUILDDIR
git clone -b $LEXEVS_SERVICE_BRANCH $LEXEVS_SERVICE_REPO && \
    cd lexevs-service && \
    mvn clean install && \
    # copy cts2 artifact to local artifacts
    cp target/*.war /lexevs-cts2-local/artifacts/lexevscts2.war && \
    mv target/*.war /artifacts/lexevscts2.war && \
    mkdir /results/lexevs-cts2 && \
    cp -R target/surefire-reports/* /results/lexevs-cts2/