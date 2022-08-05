FROM node:16.16.0-alpine AS builder

WORKDIR /app

COPY ./shared ./shared

RUN mkdir ./payment-service

COPY ./payment-service/package*.json ./payment-service/

RUN cd ./payment-service && npm ci --silent --legacy-peer-deps

COPY ./payment-service ./payment-service/

RUN cd ./payment-service && npm run build

FROM node:16.16.0-alpine

WORKDIR /app

COPY --from=builder /app ./

CMD ["npm", "run", "--prefix", "/app/payment-service", "start:prod"]

