FROM node:14 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && rm -rf node_modules
RUN npm ci --only=production

FROM node:14
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/ .
EXPOSE 8080
CMD [ "node", "src/server.js" ]
