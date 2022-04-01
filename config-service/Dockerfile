FROM node:16.14.0-alpine AS builder

WORKDIR /app

COPY ./shared ./shared

RUN mkdir ./config-service

COPY ./config-service/package*.json ./config-service/

RUN cd ./config-service && npm ci --silent --legacy-peer-deps

COPY ./config-service ./config-service/

RUN cd ./config-service && npm run build

FROM node:16.14.0-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 4000

CMD ["npm", "run", "--prefix", "/app/config-service", "start:prod"]

