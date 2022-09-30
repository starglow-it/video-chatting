FROM node:16.16.0-alpine AS builder

RUN apk update
RUN apk upgrade
RUN apk add --no-cache git

WORKDIR /app

COPY ./shared ./shared

RUN mkdir ./media-server-service

COPY ./media-server-service/package.json ./media-server-service/

RUN cd ./media-server-service && npm i --legacy-peer-deps

COPY ./media-server-service ./media-server-service/

RUN cd ./media-server-service && npm run build

FROM node:16.16.0-alpine

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

WORKDIR /app

COPY --from=builder /app ./

CMD /wait && npm run --prefix=/app/media-server-service start

