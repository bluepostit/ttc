FROM node:14-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY .version.yaml ./

# Install build requirements
RUN apk --update add --no-cache curl git python alpine-sdk \
  bash autoconf libtool automake

RUN npm ci
COPY . .
# This triggers webpack. Then remove all node_modules.
RUN npm run build && rm -rf node_modules
# Rebuild for production
RUN npm ci --only=production

FROM node:14-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/ .

# Generate secret-key
RUN ./node_modules/.bin/secure-session-gen-key > secret-key

EXPOSE 8080
CMD [ "node", "src/server.js" ]
