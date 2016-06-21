ROOT_DIR=$(pwd)

# Get environment variables from the command line for git branches and git repositories.  
# Default them if they are not set.

LEXEVS_BRANCH=${1:-bugfix/LEXEVS-1847}
LEXEVS_REPO=${2:-https://github.com/kevinpeterson/lexevs.git}

LEXEVS_REMOTE_BRANCH=${3:-bugfix/LEXEVS-1847}
LEXEVS_REMOTE_REPO=${4:-https://github.com/kevinpeterson/lexevs-remote.git}

URI_RESOLVER_TAG=${5:-tags/v1.0.0.FINAL}
URI_RESOLVER_REPO=${6:-https://github.com/cts2/URI_Resolver.git}

LEXEVS_SERVICE_BRANCH=${7:-dev}
LEXEVS_SERVICE_REPO=${8:-https://github.com/cts2/lexevs-service.git}

echo
echo LEXEVS_BRANCH : $LEXEVS_BRANCH
echo LEXEVS_REPO   : $LEXEVS_REPO
echo
echo LEXEVS_REMOTE_BRANCH : $LEXEVS_REMOTE_BRANCH
echo LEXEVS_REMOTE_REPO   : $LEXEVS_REMOTE_REPO
echo
echo URI_RESOLVER_TAG  : $URI_RESOLVER_TAG
echo URI_RESOLVER_REPO : $URI_RESOLVER_REPO
echo
echo LEXEVS_SERVICE_BRANCH : $LEXEVS_SERVICE_BRANCH
echo LEXEVS_SERVICE_REPO   : $LEXEVS_SERVICE_REPO
echo


rm -rf $ROOT_DIR/build

mkdir $ROOT_DIR/build
mkdir $ROOT_DIR/build/artifacts
mkdir $ROOT_DIR/build/results
mkdir $ROOT_DIR/build/lexevs
mkdir $ROOT_DIR/build/lexevs-remote

MAVEN_CONTAINER=$(docker run -d -P --name maven -v ~/.m2:/root/.m2:rw -v ~/.ivy2:/root/.ivy2:rw ubuntu)

cd mysql
docker build --tag mysql .
MYSQL_CONTAINER=$(docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=root mysql)
MYSQL_TEST_CONTAINER=$(docker run -d --name mysql_test -e MYSQL_ROOT_PASSWORD=root mysql)
cd ..

cd artifact-builder
docker build -t artifact-builder .
docker run --rm -v $ROOT_DIR/build/results:/results -e LEXEVS_BRANCH=$LEXEVS_BRANCH -e LEXEVS_REPO=$LEXEVS_REPO -e LEXEVS_REMOTE_BRANCH=$LEXEVS_REMOTE_BRANCH -e LEXEVS_REMOTE_REPO=$LEXEVS_REMOTE_REPO -e URI_RESOLVER_TAG=$URI_RESOLVER_TAG -e URI_RESOLVER_REPO=$URI_RESOLVER_REPO -v $ROOT_DIR/build/lexevs:/lexevs -v $ROOT_DIR/build/lexevs-remote:/lexevs-remote -v $ROOT_DIR/build/artifacts:/artifacts --volumes-from maven --link mysql:mysql artifact-builder
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
LEXEVS_CTS2_CONTAINER=$(docker run -d -p 8002:8080 -v $ROOT_DIR/build/lexevs:/lexevs -v $ROOT_DIR/build/artifacts:/artifacts --link mysql:mysql --link uriresolver:uriresolver lexevs-cts2)
cd ..

cd lexevs-remote-testrunner
docker build -t lexevs-remote-testrunner .
docker run --rm -v $ROOT_DIR/build/lexevs-remote:/lexevs-remote -v $ROOT_DIR/build/results:/results --link lexevs-remote:lexevs-remote lexevs-remote-testrunner
cd ..

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
