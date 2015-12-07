USE node

RUN apt-get update
RUN apt-get -y upgrade

COPY server.js ~/server.js
COPY package.json ~/package.json

EXPOSE 3000

RUN forever start server.js 
