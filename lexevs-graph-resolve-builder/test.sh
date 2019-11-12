BUILDDIR='/build'

mkdir $BUILDDIR && cd $BUILDDIR

export MAVEN_OPTS="-Dhttps.protocols=TLSv1.1,TLSv1.2 -Dforce.http.jre.executor=true -Xmx3072m"

# LexEVS Graph Resolve
cd $BUILDDIR
git clone -b $LEXEVS_GRAPH_RESOLVE_BRANCH $LEXEVS_GRAPH_RESOLVE_REPO && \
	cp /application.properties graph-resolve/src/main/resources/application.properties && \
    cd graph-resolve && \
    mvn clean install -DskipTests && \
    #mvn clean install "-Dpwd=lexgrid" && \
    # copy graph-resolve artifact to local artifacts
    cp target/*.war /lexevs-graph-resolve-local/graph-resolve.war && \
    mv target/*.war /artifacts/graph-resolve.war
    #mkdir /results/lexevs-graph-resolve 
    #cp -R target/surefire-reports/* /results/lexevs-graph-resolve/