FROM node:16.14.0-alpine AS builder

WORKDIR /app

COPY ./shared ./shared

RUN mkdir ./gateway-service

COPY ./gateway-service/package*.json ./gateway-service/


RUN cd ./gateway-service && npm ci --silent --legacy-peer-deps

COPY ./gateway-service ./gateway-service/

RUN cd ./gateway-service && npm run build

FROM node:16.14.0-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "run", "--prefix", "/app/gateway-service", "start:prod"]

