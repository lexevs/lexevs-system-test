FROM mysql

VOLUME /var/lib/mysql

ADD init/sql/* /sqlinit/

ADD init/init.sh /docker-entrypoint-initdb.d/