FROM  node:latest as node
WORKDIR /app
COPY . /app
RUN npm install
COPY . /app
CMD [ "node", "app.js" ]
