docker login -u gfddoaNd -p oWfta1aDFgH/pSGHbSp2+k/23XPCeL7owCLfc4M8E4oQ ncidockerhub.nci.nih.gov

cd mysql

docker pull ncidockerhub.nci.nih.gov/lexevs/nci-mysql:5.7.34

docker build --tag ncidockerhub.nci.nih.gov/lexevs/lexevs-nci-mysql:5.7.34 .

MYSQL_CONTAINER=$(docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=root ncidockerhub.nci.nih.gov/lexevs/lexevs-nci-mysql:5.7.34)

cd ..


docker run --rm --link mysql:mysql hello-world 



# logout and shutdown

docker logout ncidockerhub.nci.nih.gov
docker stop $MYSQL_CONTAINER
docker rm $MYSQL_CONTAINER