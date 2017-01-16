echo "Initializing MySQL..."
mysql -u root -proot --socket=/var/run/mysqld/mysqld.sock -e "CREATE DATABASE uriresolver"
mysql -u root -proot --socket=/var/run/mysqld/mysqld.sock -e "CREATE DATABASE lexevs"
mysql -u root -proot --socket=/var/run/mysqld/mysqld.sock uriresolver < /sqlinit/uriresolver.sql
echo "Initialization finished."