FROM node:18.7.0-alpine AS builder

RUN apk update
RUN apk upgrade
RUN apk add --no-cache git

WORKDIR /app

COPY ./shared ./shared

RUN mkdir ./config-service

COPY ./config-service/package*.json ./config-service/

RUN npm ci --legacy-peer-deps --silent --prefix=/app/config-service

COPY ./config-service ./config-service/

RUN npm run build --prefix=/app/config-service

FROM node:18.7.0-alpine

WORKDIR /app

COPY --from=builder /app ./

CMD ["npm", "run", "--prefix", "/app/config-service", "start"]
