FROM node:16.16.0-alpine AS builder

WORKDIR /app

COPY ./shared ./shared

RUN mkdir ./payment-service

COPY ./payment-service/package.json ./payment-service/

RUN cd ./payment-service && npm i --legacy-peer-deps --force

COPY ./payment-service ./payment-service/

RUN cd ./payment-service && npm run build

FROM node:16.16.0-alpine

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 5000

CMD /wait && npm run --prefix=/app/payment-service start:prod

