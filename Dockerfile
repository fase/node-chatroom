FROM node

COPY server.js /root/server.js
COPY package.json /root/package.json
COPY lib/chat_server.js /root/lib/chat_server.js
COPY public/ /root/public/

RUN cd /root \
  && npm install

EXPOSE 3000

CMD node /root/server.js 
