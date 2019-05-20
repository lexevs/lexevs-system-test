#!/bin/bash

ROOT_DIR=$(pwd)

# Docker image tags to be created for lexevs artifacts
# These images will be on the NCI docker hub 
#TAG_MYSQL=lexevs-mysql:6.5.21
TAG_MYSQL=ncidockerhub.nci.nih.gov/lexevs/lexevs-nci-mysql:5.6.33
#TAG_URIRESOLVER=lexevs-uriresolver:6.5.2
TAG_URIRESOLVER=ncidockerhub.nci.nih.gov/lexevs/lexevs-uriresolver:6.5.2
#TAG_CTS2=lexevs-cts2:6.5.2
TAG_CTS2=ncidockerhub.nci.nih.gov/lexevs/lexevs-cts2:6.5.2
#TAG_REMOTE_API=lexevs-remote:6.5.2
TAG_REMOTE_API=ncidockerhub.nci.nih.gov/lexevs/lexevs-remote:6.5.2
TAG_TEST_LOAD=ncidockerhub.nci.nih.gov/lexevs/lexevs-test-load:6.5.2

# Get environment variables from the command line for git branches and git repositories.  
# Default them if they are not set.
#
# Get environment variables from the command line for the user and pw pass of the NCI Nexus server (internal Docker hub).
# This will allow the script to log in and pull Docker images stored on the NCI Nexus Server.
# 
# Note: This script will need to be run behind the NCI Firewall/on VPN to successfully log in and pull these internal Docker images. 

LEXEVS_BRANCH=${1:-dev}
LEXEVS_REPO=${2:-https://github.com/lexevs/lexevs.git}

LEXEVS_REMOTE_BRANCH=${3:-dev}
LEXEVS_REMOTE_REPO=${4:-https://github.com/lexevs/lexevs-remote.git}

URI_RESOLVER_BRANCH=${5:-v1.0.0}
URI_RESOLVER_REPO=${6:-https://github.com/cts2/URI_Resolver.git}

LEXEVS_SERVICE_BRANCH=${7:-dev}
LEXEVS_SERVICE_REPO=${8:-https://github.com/cts2/lexevs-service.git}

NCI_DOCKER_USER=${9}
NCI_DOCKER_PW=${10}

#
# Option to skip CTS2 build and tests: -skipCts2
# Option to skip lexevs-remote API build and tests: -skipRemote
#
TEST_OPTIONS=${11}

#*****************************************************************
# Output the user variables
#*****************************************************************
echo
echo LEXEVS_BRANCH : $LEXEVS_BRANCH
echo LEXEVS_REPO   : $LEXEVS_REPO
echo
echo LEXEVS_REMOTE_BRANCH : $LEXEVS_REMOTE_BRANCH
echo LEXEVS_REMOTE_REPO   : $LEXEVS_REMOTE_REPO
echo
echo URI_RESOLVER_BRANCH  : $URI_RESOLVER_BRANCH
echo URI_RESOLVER_REPO    : $URI_RESOLVER_REPO
echo
echo LEXEVS_SERVICE_BRANCH : $LEXEVS_SERVICE_BRANCH
echo LEXEVS_SERVICE_REPO   : $LEXEVS_SERVICE_REPO
echo
echo NCI_DOCKER_USER       : $NCI_DOCKER_USER
echo
echo TEST_OPTIONS          : $TEST_OPTIONS
echo

#*****************************************************************
# Verify that the NCI Nexus user name is passed in.  
# Exit if it is not set.
#*****************************************************************
if [ -z "$NCI_DOCKER_USER" ]; 
	then echo "NCI_DOCKER_USER is no set. Exiting.";
	exit;	
fi

#*****************************************************************
# Verify that the NCI Nexus password is passed in.  
# Exit if it is not set.
#*****************************************************************
if [ -z "$NCI_DOCKER_PW" ]; 
	then echo "NCI_DOCKER_PW is not set. Exiting."; 
	exit;
fi

#*****************************************************************
# Log in to NCI Nexus Docker hub
#*****************************************************************
LOGIN_RESULT="$(docker login -u $NCI_DOCKER_USER -p $NCI_DOCKER_PW ncidockerhub.nci.nih.gov)"

echo 
echo $LOGIN_RESULT

#*****************************************************************
# If the login result doesn't contain the following text, then exit.
#*****************************************************************
if [[ $LOGIN_RESULT != *"Succeeded"* ]];
	then echo "NCI Nexus Docker login failed . Exiting.";
	exit;
fi

#*****************************************************************
# Remove artifact directories and recreate them fresh.
#*****************************************************************
rm -rf $ROOT_DIR/build

# add artifacts to local directories so dockerfiles have access to them
rm -rf $ROOT_DIR/uriresolver/artifacts
rm -rf $ROOT_DIR/lexevs-remote/artifacts
rm -rf $ROOT_DIR/lexevs-cts2/artifacts

mkdir $ROOT_DIR/build
mkdir $ROOT_DIR/build/artifacts
mkdir $ROOT_DIR/build/results
mkdir $ROOT_DIR/build/lexevs
mkdir $ROOT_DIR/build/lexevs-remote

mkdir $ROOT_DIR/uriresolver/artifacts
mkdir $ROOT_DIR/lexevs-remote/artifacts
mkdir $ROOT_DIR/lexevs-cts2/artifacts

#*****************************************************************
# Artifacts that are built and tested to exist
#*****************************************************************
LEXEVS_ARTIFACT="$ROOT_DIR/build/lexevs/runtime-components/lexbig.jar"
URI_RESOLVER_ARTIFACT="$ROOT_DIR/build/artifacts/uriresolver.war"
LEXEVS_REMOTE_ARTIFACT="$ROOT_DIR/build/artifacts/lexevsapi65.war"
LEXEVS_CTS2_ARTIFACT="$ROOT_DIR/build/artifacts/lexevscts2.war"

#*****************************************************************
# Shutdown function will log out of the NCI dockerhub and 
# stop/remove any LexEVS container that have been created.
#*****************************************************************
function shutdownBuild() {
	echo "*** SHUTDOWN CALLED ***"
	
	echo
	echo Logging out of NCI Nexus Docker hub
	echo 
	
	docker logout ncidockerhub.nci.nih.gov
		
	#Determine which containers to stop based on what was built
	if [[ $TEST_OPTIONS != *"-skipCts2"* ]];
	then
		docker stop $LEXEVS_CTS2_CONTAINER
		docker stop $URIRESOLVER_CONTAINER
	fi
	
	if [[ $TEST_OPTIONS != *"-skipRemote"* ]];
	then
		docker stop $LEXEVS_REMOTE_CONTAINER
	fi
	
	docker stop $MAVEN_CONTAINER
	docker stop $MYSQL_CONTAINER
	docker stop $MYSQL_TEST_CONTAINER
	
	#Determine which containers to remove based on what was built
	
	if [[ $TEST_OPTIONS != *"-skipCts2"* ]];
	then
		docker rm $LEXEVS_CTS2_CONTAINER
		docker rm $URIRESOLVER_CONTAINER
	fi
	
	if [[ $TEST_OPTIONS != *"-skipRemote"* ]];
	then
		docker rm $LEXEVS_REMOTE_CONTAINER
	fi
	
	docker rm $MAVEN_CONTAINER
	docker rm $MYSQL_CONTAINER
	docker rm $MYSQL_TEST_CONTAINER
} 

#*****************************************************************
# Start creating containers, builds and tests
#*****************************************************************
MAVEN_CONTAINER=$(docker run -d -P --name maven -v ~/.m2:/root/.m2:rw -v ~/.ivy2:/root/.ivy2:rw ubuntu)

#*****************************************************************
# Create two MySQL containers for testing
#*****************************************************************
cd mysql
docker pull ncidockerhub.nci.nih.gov/lexevs/nci-mysql:5.6.33
docker build --tag $TAG_MYSQL .
docker push $TAG_MYSQL
MYSQL_CONTAINER=$(docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=root $TAG_MYSQL)
MYSQL_TEST_CONTAINER=$(docker run -d --name mysql_test -e MYSQL_ROOT_PASSWORD=root $TAG_MYSQL)
echo "Tagged and started MySQL containers";
cd ..

#*****************************************************************
# Artifact builder will build lexevs, lexevs-remote, 
# and uri resolver
#*****************************************************************
cd artifact-builder
docker build -t artifact-builder .
docker run --rm -v $ROOT_DIR/build/results:/results -e LEXEVS_BRANCH=$LEXEVS_BRANCH -e LEXEVS_REPO=$LEXEVS_REPO -e LEXEVS_REMOTE_BRANCH=$LEXEVS_REMOTE_BRANCH -e LEXEVS_REMOTE_REPO=$LEXEVS_REMOTE_REPO -e URI_RESOLVER_BRANCH=$URI_RESOLVER_BRANCH -e URI_RESOLVER_REPO=$URI_RESOLVER_REPO -e TEST_OPTIONS=$TEST_OPTIONS -v $ROOT_DIR/build/lexevs:/lexevs -v $ROOT_DIR/build/lexevs-remote:/lexevs-remote -v $ROOT_DIR/build/artifacts:/artifacts -v $ROOT_DIR/lexevs-remote/artifacts:/lexevs-remote-local -v $ROOT_DIR/uriresolver/artifacts:/uriresolver-local --volumes-from maven --link mysql:mysql artifact-builder
echo "Artifact builder completed";
cd ..

#*****************************************************************
# Verify that lexevs, lexevs-remote, and uri resolver were built
# successfully.  If any one of the builds failed, then exit.
#*****************************************************************
# If the lexevs artifact didn't build successfully, then exit 
if [[ ! -e "$LEXEVS_ARTIFACT" ]];
then 
	echo "LexEVS BUILD FAILED "
	shutdownBuild
	exit 1
else
	echo "LexEVS BUILD SUCCESSFUL"
fi

#*****************************************************************
# If the URI Resolver artifact didn't build successfully 
# (artifact not present) AND user is not skipping cts2, 
# then exit with error. 
#*****************************************************************
if [[ ! -e "$URI_RESOLVER_ARTIFACT" ]];

then 
	if [[ "$TEST_OPTIONS" !=  *"-skipCts2"* ]];
	then
		echo "URIRESOLVER BUILD FAILED (no -skipCts2 option set)"
		shutdownBuild
		exit 1
	else
		echo "URIRESOLVER BUILD SKIPPED"
	fi
else
	echo "URIRESOLVER BUILD SUCCESSFUL (or skipped)"
fi

# If the lexevs remote API artifact didn't build successfully, then exit 
if [[ ! -e "$LEXEVS_REMOTE_ARTIFACT" ]];
then 
	if [[ "$TEST_OPTIONS" !=  *"-skipRemote"* ]];
	then
		echo "LEXEVS REMOTE API BUILD FAILED (no -skipRemote set)"
		shutdownBuild
		exit 1
	else
		echo "LEXEVS REMOTE API BUILD SKIPPED"
	fi
else
	echo "LEXEVS REMOTE API BUILD SUCCESSFUL"
fi

#*****************************************************************
# Determine if uriresolver and lexevs-service should be built,
# based on input to the script.
#*****************************************************************
if [[ "$TEST_OPTIONS" ==  *"-skipCts2"* ]]; 
then 
	echo "** SKIP CTS2. URIRESOLVER will not be built **"; 
	echo "** SKIP CTS2. LEXEVS-SERVICE will not be built **"; 
else
	echo "Building URIRESOLVER"; 
	cd uriresolver
	docker build --tag $TAG_URIRESOLVER .
	docker push $TAG_URIRESOLVER
	URIRESOLVER_CONTAINER=$(docker run -d --name uriresolver -p 8001:8080 -v $ROOT_DIR/build/artifacts:/artifacts --link mysql:mysql $TAG_URIRESOLVER)
	cd ..
	
	echo "Building LEXEVS-SERVICE"; 
	cd lexevs-cts2-builder
	docker build -t lexevs-cts2-builder .
	docker run --rm -e LEXEVS_SERVICE_BRANCH=$LEXEVS_SERVICE_BRANCH -e LEXEVS_SERVICE_REPO=$LEXEVS_SERVICE_REPO -v $ROOT_DIR/build/results:/results -v $ROOT_DIR/lexevs-cts2/artifacts:/lexevs-cts2-local -v $ROOT_DIR/build/artifacts:/artifacts --volumes-from maven -e "uriResolutionServiceUrl=http://uriresolver:8080/uriresolver/" --link uriresolver:uriresolver lexevs-cts2-builder
	cd ..
	
	# If the lexevs CTS2 artifact didn't build successfully, then exit 
	if [[ ! -e "$LEXEVS_CTS2_ARTIFACT" ]];
	then 
		if [[ "$TEST_OPTIONS" !=  *"-skipCts2"* ]];
		then
			echo "LEXEVS CTS2 BUILD FAILED (no -skipCts2 option set)"
			shutdownBuild
			exit 1
		else
			echo "LEXEVS CTS2 BUILD SUCCESSFUL"
		fi 
	fi
fi


#*****************************************************************
# Build and run lexevs tests in a Docker container. 
# Automatically remove the container when it exits. 
#*****************************************************************
cd lexevs-testrunner
docker build -t lexevs-testrunner .
docker run --rm -v $ROOT_DIR/build/lexevs:/lexevs -v $ROOT_DIR/build/results:/results --link mysql_test:mysql_test lexevs-testrunner
cd ..

#*****************************************************************
# Create a Docker container for lexevs and connects to the mysql
# container.  This will load terminologies via the lexevs/admin 
# scripts.  This container will be used for remote API and 
# lexevs cts2 integration tests.  
#*****************************************************************
cd lexevs-load
docker build --tag $TAG_TEST_LOAD .
docker push $TAG_TEST_LOAD
docker run --rm -v $ROOT_DIR/build/lexevs:/lexevs --link mysql:mysql $TAG_TEST_LOAD
cd ..

#*****************************************************************
# Determine if lexevs-remote should be built
#*****************************************************************
if [[ "$TEST_OPTIONS" == *"-skipRemote"* ]];
then
	echo "** SKIP LEXEVS-REMOTE. LEXEVS-REMTOE container will not be built. **"; 
else
	echo "**  BUILDING LEXEVS-REMOTE CONTAINER **";
	cd lexevs-remote
	docker build --tag $TAG_REMOTE_API .
	docker push $TAG_REMOTE_API
	LEXEVS_REMOTE_CONTAINER=$(docker run -d --name lexevs-remote -p 8000:8080 -v $ROOT_DIR/build/lexevs:/lexevs -v $ROOT_DIR/build/artifacts:/artifacts --link mysql:mysql $TAG_REMOTE_API)
	echo "DONE - BUILDING LEXEVS-REMOTE CONTAINER"
	cd ..
fi

#*****************************************************************
# Determine if lexevs-cts2 and lexevs-cts2-testrunner 
# should be built.
#*****************************************************************
if [[ "$TEST_OPTIONS" == *"-skipCts2"* ]]; 
then 
	echo "** SKIP CTS2. LEXEVS-CTS2 container will not be deployed **"; 
	echo "** SKIP CTS2. LEXEVS-CTS2-TESTRUNNER will not be built **"; 
else
	cd lexevs-cts2
	docker build --tag $TAG_CTS2 .
	docker push $TAG_CTS2
	LEXEVS_CTS2_CONTAINER=$(docker run -d --name lexevs-cts2 -p 8002:8080  -e USER_HOME=/home/tomcata  -v $ROOT_DIR/build/lexevs:/lexevs -v $ROOT_DIR/build/artifacts:/artifacts --link mysql:mysql --link uriresolver:uriresolver $TAG_CTS2)
	cd ..

	cd lexevs-cts2-testrunner
	docker build -t lexevs-cts2-testrunner .
	docker run --rm -v $ROOT_DIR/build/lexevs:/lexevs -v $ROOT_DIR/build/results:/results --link lexevs-cts2:lexevs-cts2 lexevs-cts2-testrunner
	cd ..
fi	

if [[ "$TEST_OPTIONS" == *"-skipRemote"* ]];
then
	echo "** SKIP LEXEVS-REMOTE-TESTRUNNER.  LEXEVS-REMTOE-TESTRUNNER will not be built. **"; 
else	
	cd lexevs-remote-testrunner
	docker build -t lexevs-remote-testrunner .
	docker run --rm -v $ROOT_DIR/build/lexevs-remote:/lexevs-remote -v $ROOT_DIR/build/results:/results --link lexevs-remote:lexevs-remote lexevs-remote-testrunner
	
	cd ..
fi


#tail -f test.sh

#*****************************************************************
# Debug information.  Output logs from the main containers.
#*****************************************************************
echo
echo ************** LEXEVS_REMOTE_CONTAINER
echo

#docker exec lexevs-remote cat /local/content/tomcat/container/logs/catalina.out

echo
echo ************** LEXEVS_CTS2_CONTAINER
echo

#docker exec lexevs-cts2 cat /local/content/tomcat/container/logs/catalina.out

echo
echo ************** URIRESOLVER_CONTAINER
echo

#docker exec uriresolver cat /local/content/tomcat/container/logs/catalina.out

#*****************************************************************
# Build is done. Time to shutdown
#*****************************************************************
shutdownBuild
