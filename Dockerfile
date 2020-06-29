FROM  node:latest as node
WORKDIR /app
COPY . /app
RUN npm install && cd client && npm install
COPY . /app
EXPOSE 5000 5001
CMD [ "npm", "start" ]
