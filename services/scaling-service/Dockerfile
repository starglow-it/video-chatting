FROM node:16.16.0-alpine AS builder

WORKDIR /app

COPY ./shared ./shared

RUN mkdir ./scaling-service

COPY ./scaling-service/package.json ./scaling-service/

RUN cd ./scaling-service && npm i --legacy-peer-deps --force

COPY ./scaling-service ./scaling-service/

RUN cd ./scaling-service && npm run build

FROM node:16.16.0-alpine

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 6000

CMD /wait && npm run --prefix=/app/scaling-service start:prod

