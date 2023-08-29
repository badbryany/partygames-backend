FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && npm i pm2

COPY . .

EXPOSE 8080
EXPOSE 3000

CMD [ "pm2", "start","server.js" ]