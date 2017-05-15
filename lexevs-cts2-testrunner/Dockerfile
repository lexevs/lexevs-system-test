FROM ubuntu:16.04

RUN apt-get update  && \
	apt-get install nodejs -y  && \
	apt-get install npm -y  && \
	npm install --save-dev frisby  && \
	npm install -g jasmine-node && \
	ln -s /usr/bin/nodejs /usr/bin/node
	
ADD test.sh /
ADD cts2Calls_spec.js /
ADD test_spec.js /

CMD sh /test.sh 