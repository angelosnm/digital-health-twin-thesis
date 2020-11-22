FROM  node:latest as node

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install 

COPY . .

EXPOSE 5000

CMD ["server.js"]
