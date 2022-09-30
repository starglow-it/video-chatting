FROM node:16.16.0-alpine AS builder

RUN apk update
RUN apk upgrade
RUN apk add --no-cache git

WORKDIR /app

COPY ./shared ./shared

RUN mkdir ./notifications-service

COPY ./notifications-service/package.json ./notifications-service/

RUN cd ./notifications-service && npm i --legacy-peer-deps

COPY ./notifications-service ./notifications-service/

RUN cd ./notifications-service && npm run build

FROM node:16.16.0-alpine

WORKDIR /app

COPY --from=builder /app ./

CMD ["npm", "run", "--prefix", "/app/notifications-service", "start"]
