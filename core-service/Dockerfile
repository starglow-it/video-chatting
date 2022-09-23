FROM node:18.0-alpine AS builder

RUN npm install -g @nestjs/cli

WORKDIR /app

COPY ./shared ./shared

RUN mkdir ./core-service

COPY ./core-service ./core-service/

RUN cd ./core-service && npm ci --legacy-peer-deps

RUN npm run --prefix=/app/core-service build

FROM node:18.0-alpine

RUN apk update
RUN apk add ffmpeg

WORKDIR /app

COPY --from=builder /app ./

CMD ["npm", "run", "--prefix", "/app/core-service", "start:prod"]
