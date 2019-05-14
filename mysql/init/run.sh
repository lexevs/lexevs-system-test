echo "in MySQL run.sh script"
cp /init.sh /docker-entrypoint-initdb.d/ && \
	cd /docker-entrypoint-initdb.d/ && \
	./init.sh
echo "DONE running init.sh"
