FROM node:6.11

RUN apt-get update  && \
	npm install frisby@2.0.11 --save-dev   && \
	npm install -g jasmine-node@1.14.5 
	
ADD test.sh /
ADD cts2Calls_spec.js /

CMD sh /test.sh 