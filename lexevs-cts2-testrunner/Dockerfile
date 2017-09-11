FROM node:6.11

RUN apt-get update  && \
	npm install frisby --save-dev   && \
	npm install -g jasmine-node 
	
ADD test.sh /
ADD cts2Calls_spec.js /

CMD sh /test.sh 