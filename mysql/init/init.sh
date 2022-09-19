echo "Initializing MySQL..."

mysql -u root -proot -e "CREATE DATABASE uriresolver" 
mysql -u root -proot uriresolver < /sqlinit/uriresolver.sql
echo "uriresolver db finished"
mysql -u root -proot -e "CREATE DATABASE lexevs"

if [ "x$LOAD_LEXEVS_DB" = "x" ] ; 
	then 
		echo "Argument not provided" ;
		echo "Don't import the lexevs DB" ; 
		echo "-------------------------" ; 
		
	else 
		echo "Argument is $LOAD_LEXEVS_DB" 
		echo "Build test lexevs db" 
		echo "-------------------------"  
		mysql -u root -proot lexevs < /sqlinit/lexevs.sql
		echo "First db file finished"
		mysql -u root -proot lexevs < /sqlint/lexevs2.sql
		echo "second db file finished"
		mysql -u root -proot lexevs < /sqlint/ValueSets.sql
  	echo "value sets db file finished"
  	mysql -u root -proot lexevs < /sqlint/NciHistory.sql
    echo "history db file finished"
		echo "Initialization finished."

		echo "Copying Indexes over."
		cp -R /lbIndex/ /lexevs/resources/ 
		echo "Indexes copied over." 
	fi