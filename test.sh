ROOT_DIR=$(pwd)

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

# Verify that the NCI Nexus user name is passed in.  Exit if it is not set.
if [ -z "$NCI_DOCKER_USER" ]; 
	then echo "NCI_DOCKER_USER is no set. Exiting.";
	exit;	
fi

# Verify that the NCI Nexus password is passed in.  Exit if it is not set.
if [ -z "$NCI_DOCKER_PW" ]; 
	then echo "NCI_DOCKER_PW is no set. Exiting."; 
	exit;
fi

# Log in to NCI Nexus Docker hub
LOGIN_RESULT="$(docker login -u $NCI_DOCKER_USER -p $NCI_DOCKER_PW ncidockerhub.nci.nih.gov)"

echo 
echo $LOGIN_RESULT

# If the login result doesn't contain the following text, then exit.
if [[ $LOGIN_RESULT != *"Succeeded"* ]];
	then echo "NCI Nexus Docker login failed . Exiting.";
	exit;
fi

rm -rf $ROOT_DIR/build

mkdir $ROOT_DIR/build
mkdir $ROOT_DIR/build/artifacts
mkdir $ROOT_DIR/build/results
mkdir $ROOT_DIR/build/lexevs
mkdir $ROOT_DIR/build/lexevs-remote

MAVEN_CONTAINER=$(docker run -d -P --name maven -v ~/.m2:/root/.m2:rw -v ~/.ivy2:/root/.ivy2:rw ubuntu)

cd mysql
docker pull ncidockerhub.nci.nih.gov/lexevs/nci-mysql:5.6.33
docker build --tag mysql:5.6.33 .
MYSQL_CONTAINER=$(docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=root mysql:5.6.33)
MYSQL_TEST_CONTAINER=$(docker run -d --name mysql_test -e MYSQL_ROOT_PASSWORD=root mysql:5.6.33)
cd ..

cd artifact-builder
docker build -t artifact-builder .
docker run --rm -v $ROOT_DIR/build/results:/results -e LEXEVS_BRANCH=$LEXEVS_BRANCH -e LEXEVS_REPO=$LEXEVS_REPO -e LEXEVS_REMOTE_BRANCH=$LEXEVS_REMOTE_BRANCH -e LEXEVS_REMOTE_REPO=$LEXEVS_REMOTE_REPO -e URI_RESOLVER_BRANCH=$URI_RESOLVER_BRANCH -e URI_RESOLVER_REPO=$URI_RESOLVER_REPO -v $ROOT_DIR/build/lexevs:/lexevs -v $ROOT_DIR/build/lexevs-remote:/lexevs-remote -v $ROOT_DIR/build/artifacts:/artifacts --volumes-from maven --link mysql:mysql artifact-builder
cd ..

cd uriresolver
docker build -t uriresolver .
URIRESOLVER_CONTAINER=$(docker run -d --name uriresolver -p 8001:8080 -v $ROOT_DIR/build/artifacts:/artifacts --link mysql:mysql uriresolver)
cd ..

cd lexevs-cts2-builder
docker build -t lexevs-cts2-builder .
docker run --rm -v $ROOT_DIR/build/results:/results -e LEXEVS_SERVICE_BRANCH=$LEXEVS_SERVICE_BRANCH -e LEXEVS_SERVICE_REPO=$LEXEVS_SERVICE_REPO -v $ROOT_DIR/build/artifacts:/artifacts --volumes-from maven -e "uriResolutionServiceUrl=http://uriresolver:8080/uriresolver/" --link uriresolver:uriresolver lexevs-cts2-builder
cd ..

cd lexevs-testrunner
docker build -t lexevs-testrunner .
docker run --rm -v $ROOT_DIR/build/lexevs:/lexevs -v $ROOT_DIR/build/results:/results --link mysql_test:mysql_test lexevs-testrunner
docker stop $MYSQL_TEST_CONTAINER
docker rm $MYSQL_TEST_CONTAINER
cd ..

cd lexevs-load
docker build -t lexevs-load .
docker run --rm -v $ROOT_DIR/build/lexevs:/lexevs --link mysql:mysql lexevs-load
cd ..

cd lexevs-remote
docker build -t lexevs-remote .
LEXEVS_REMOTE_CONTAINER=$(docker run -d --name lexevs-remote -p 8000:8080 -v $ROOT_DIR/build/lexevs:/lexevs -v $ROOT_DIR/build/artifacts:/artifacts --link mysql:mysql lexevs-remote)
cd ..

cd lexevs-cts2
docker build -t lexevs-cts2 .
LEXEVS_CTS2_CONTAINER=$(docker run -d --name lexevs-cts2 -p 8002:8080 -v $ROOT_DIR/build/lexevs:/lexevs -v $ROOT_DIR/build/artifacts:/artifacts --link mysql:mysql --link uriresolver:uriresolver lexevs-cts2)
cd ..

cd lexevs-cts2-testrunner
docker build -t lexevs-cts2-testrunner .
docker run --rm -v $ROOT_DIR/build/lexevs:/lexevs -v $ROOT_DIR/build/results:/results --link lexevs-cts2:lexevs-cts2 lexevs-cts2-testrunner
cd ..

cd lexevs-remote-testrunner
docker build -t lexevs-remote-testrunner .
docker run --rm -v $ROOT_DIR/build/lexevs-remote:/lexevs-remote -v $ROOT_DIR/build/results:/results --link lexevs-remote:lexevs-remote lexevs-remote-testrunner
cd ..

echo
echo Logging out of NCI Nexus Docker hub
echo 

docker logout ncidockerhub.nci.nih.gov

docker stop $LEXEVS_CTS2_CONTAINER
docker stop $URIRESOLVER_CONTAINER
docker stop $LEXEVS_REMOTE_CONTAINER
docker stop $MAVEN_CONTAINER
docker stop $MYSQL_CONTAINER

docker rm $LEXEVS_CTS2_CONTAINER
docker rm $URIRESOLVER_CONTAINER
docker rm $LEXEVS_REMOTE_CONTAINER
docker rm $MAVEN_CONTAINER
docker rm $MYSQL_CONTAINER
