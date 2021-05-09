FROM node:14-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./

# Dependencies for node-prune
RUN apk update && apk add curl bash && rm -rf /var/cache/apk/*
# Install node-prune
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

RUN npm ci
COPY . .
# This triggers webpack. Then remove all node_modules.
RUN npm run build && rm -rf node_modules
# Rebuild and prune for production
RUN npm ci --only=production && npm prune --production

FROM node:14-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/ .
EXPOSE 8080
CMD [ "node", "src/server.js" ]
