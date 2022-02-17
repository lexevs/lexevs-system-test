FROM node:8.16.0

RUN apt-get update  && \
	npm install frisby@2.0.11 --save-dev   && \
	npm install -g jasmine-node@1.14.5 
	
ADD test.sh /
ADD graph-resolveCalls_spec.js /

CMD sh /test.sh 