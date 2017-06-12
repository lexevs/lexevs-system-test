echo "Initializing MySQL..."
mysql -u root -proot -e "CREATE DATABASE uriresolver" 
mysql -u root -proot -e "CREATE DATABASE lexevs"
mysql -u root -proot uriresolver < /sqlinit/uriresolver.sql
echo "Initialization finished."