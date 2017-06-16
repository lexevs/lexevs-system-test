FROM ncidockerhub.nci.nih.gov/lexevs/nci-mysql:5.6.33

VOLUME /var/lib/mysql

ADD init/sql/* /sqlinit/

ADD init/init.sh /docker-entrypoint-initdb.d/