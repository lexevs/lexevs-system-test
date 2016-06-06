BUILDDIR='/build'

mkdir $BUILDDIR && cd $BUILDDIR

# LexEVS CTS2
cd $BUILDDIR
git clone -b dev https://github.com/cts2/lexevs-service.git && \
    cd lexevs-service && \
    mvn clean install && \
    mv target/*.war /artifacts/lexevscts2.war && \
    mkdir /results/lexevs-cts2 && \
    cp -R target/surefire-reports/* /results/lexevs-cts2/