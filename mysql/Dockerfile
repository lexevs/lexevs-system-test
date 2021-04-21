FROM ncidockerhub.nci.nih.gov/lexevs/nci-mysql:5.7.34

VOLUME /var/lib/mysql

ADD init/sql/* /sqlinit/
RUN chmod 775 /sqlinit/uriresolver.sql

ADD my.cnf /etc/mysql/my.cnf

# Adding a zip file.  This will automatically unzip the indexes for LexEVS.
ADD /init/lbIndex.zip /
RUN chmod 775  -R /lbIndex

ADD init/init.sh /docker-entrypoint-initdb.d/

# Pass in variable.  If variable is set, then load the test lexevs db with sample data.
RUN chmod 775 /docker-entrypoint-initdb.d/init.sh ${LOAD_LEXEVS_DB}