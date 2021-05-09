FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci --only=production
RUN npm install webpack webpack-cli
COPY . .
RUN npm run build

EXPOSE 8080
CMD [ "node", "src/server.js" ]
