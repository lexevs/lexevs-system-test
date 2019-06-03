#!/bin/bash

BUILDDIR='/build'
LEXEVSDIR='lexevs'

mkdir $BUILDDIR && cd $BUILDDIR

rm -rf /lexevs/*
echo "****** removing /lexevs sub directories of shared volume";

export MAVEN_OPTS="-Dhttps.protocols=TLSv1.1,TLSv1.2 -Dforce.http.jre.executor=true -Xmx3072m"
export ANT_OPTS="-Dhttps.protocols=TLSv1.1,TLSv1.2 -Dforce.http.jre.executor=true -Xmx3072m"
 
echo "branch = " $LEXEVS_BRANCH
echo "repo   = " $LEXEVS_REPO

# LexEVS
git clone --branch $LEXEVS_BRANCH $LEXEVS_REPO && \
    cd lexevs && \
    ant 
    
echo "done building lexevs";

cp -f /lbconfig.props /build/lexevs/lbPackager/antbuild/resources/config
cp /mysql-connector-java-5.1.37.jar /build/lexevs/lbPackager/antbuild/runtime/sqlDrivers
cp -r /build/lexevs/lbPackager/antbuild/* /lexevs/
cp -f /lbconfig.props /lexevs/resources/config/
cp /mysql-connector-java-5.1.37.jar /lexevs/runtime/sqlDrivers

chmod -R 775 /lexevs
echo "change permissions on /lexevs"

if [ "x$LEXEVS_BUILD_ONLY" = "x" ] ; 

	then 
		echo "Argument LEXEVS_BUILD_ONLY not provided" ;
		echo "Continue with builds..." ; 
		echo "-------------------------" ; 

		#
		# If -skipRemote, then we don't need to build the lexevs-remote
		# 
		if [[ "$TEST_OPTIONS" == *"-skipRemote"* ]];
		then 
			echo "** SKIP LEXEVS-REMOTE.  LEXEVS-REMOTE will not be built. "
		else
			echo "** Building LEXEVS-REMOTE **"; 
			cd $BUILDDIR
			git clone -b $LEXEVS_REMOTE_BRANCH $LEXEVS_REMOTE_REPO && \
			    cd lexevs-remote/LexEVSService && \
		    	cp /lexevs/runtime-components/lexbig.jar system/lib/ && \
		    	cp /lexevs/test/lbTest.jar test/lib/ && \
		    	ant && \
		    	# copy lexevs-remote artifact to local artifacts
		        cp output/lexevsapi65/package/webapp/*.tomcat.war /lexevs-remote-local/lexevsapi65.war && \
		    	mv output/lexevsapi65/package/webapp/*.tomcat.war /artifacts/lexevsapi65.war && \
		    	cp -r ../* /lexevs-remote/
		    	echo "****** done building remote";
		fi	    
		
		#
		# If -skipCts2, then we don't need to build the URI Resolver
		#
		if [[ "$TEST_OPTIONS" == *"-skipCts2"* ]]; 
		then 
			echo "** SKIP CTS2.  URI RESOLVER will not be built."
		else
			echo "** Building URI RESOLVER **"; 
			cd $BUILDDIR
			git clone -b $URI_RESOLVER_BRANCH $URI_RESOLVER_REPO && \
			   	cd URI_Resolver && \
		    	mvn clean install && \  
		        # copy uriresolver artifact to local artifacts
		        cp target/*.war /uriresolver-local/uriresolver.war && \   
		    	mv target/*.war /artifacts/uriresolver.war && \
		    	mkdir /results/uriresolver && \
		    	cp -R target/surefire-reports/* /results/uriresolver/
		    	echo "****** done building uri resolver";
		fi
	else
		echo "Argument LEXEVS_BUILD_ONLY was set" ;
		echo "Don't build remote and uri resolver ..." ; 
		echo "-------------------------" ; 
	fi
		