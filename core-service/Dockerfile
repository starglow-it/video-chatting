FROM node:16.16.0-alpine AS builder

WORKDIR /app

COPY ./shared ./shared

RUN mkdir ./core-service

COPY ./core-service/package*.json ./core-service/

RUN cd ./core-service && npm ci --silent --legacy-peer-deps

COPY ./core-service ./core-service/

RUN cd ./core-service && npm run build

FROM node:16.16.0-alpine

RUN apk update
RUN apk add ffmpeg

WORKDIR /app

COPY --from=builder /app ./

CMD ["npm", "run", "--prefix", "/app/core-service", "start:prod"]
