FROM node:16.16.0-alpine AS builder

RUN npm install -g @nestjs/cli

WORKDIR /app

COPY ./shared ./shared

RUN mkdir ./gateway-service

COPY ./gateway-service/package*.json ./gateway-service/

RUN cd ./gateway-service && npm ci --legacy-peer-deps

COPY ./gateway-service ./gateway-service/

RUN npm run --prefix=/app/gateway-service build

FROM node:16.16.0-alpine

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD /wait && npm run --prefix=/app/gateway-service start:prod
