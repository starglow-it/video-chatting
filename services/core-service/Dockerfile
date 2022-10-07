FROM node:18.7.0-alpine AS builder

WORKDIR /app

COPY ./shared ./shared

RUN mkdir ./core-service

COPY ./core-service/package*.json ./core-service/

RUN npm ci --silent --legacy-peer-deps --prefix=/app/core-service

COPY ./core-service ./core-service/

RUN npm run build --prefix=/app/core-service

FROM node:18.7.0-alpine

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

RUN apk update
RUN apk add ffmpeg

WORKDIR /app

COPY --from=builder /app ./

CMD /wait && npm run start:prod --prefix=/app/core-service
