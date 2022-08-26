FROM node:16.16.0-alpine AS builder

RUN apk update
RUN apk upgrade
RUN apk add --no-cache git

WORKDIR /app

COPY ./shared ./shared

RUN mkdir ./config-service

COPY ./config-service/package.json ./config-service/

RUN cd ./config-service && npm i --legacy-peer-deps

COPY ./config-service ./config-service/

RUN cd ./config-service && npm run build

FROM node:16.16.0-alpine

WORKDIR /app

COPY --from=builder /app ./

CMD ["npm", "run", "--prefix", "/app/config-service", "start"]
