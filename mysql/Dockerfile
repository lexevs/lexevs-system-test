FROM ncidockerhub.nci.nih.gov/lexevs/nci-mysql:5.6.33

#USER root

VOLUME /var/lib/mysql

ADD init/sql/* /sqlinit/
RUN chmod 775 /sqlinit/uriresolver.sql

ADD my.cnf /etc/mysql/my.cnf

ADD init/init.sh /docker-entrypoint-initdb.d/
RUN chmod 775 /docker-entrypoint-initdb.d/init.sh