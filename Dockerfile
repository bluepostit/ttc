FROM node:14 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
RUN npm install -D webpack webpack-cli
COPY . .
RUN npm run build && npm remove webpack webpack-cli
RUN rm -rf client/src client/style package*.json weback*.js

FROM node:14
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/ .
EXPOSE 8080
CMD [ "node", "src/server.js" ]
