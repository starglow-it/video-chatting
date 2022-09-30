FROM node:16.16.0-alpine AS builder

WORKDIR /app

COPY ./shared ./shared

RUN mkdir ./auth-service

COPY ./auth-service/package.json ./auth-service/

RUN cd ./auth-service && npm i --legacy-peer-deps

COPY ./auth-service ./auth-service/

RUN cd ./auth-service && npm run build

FROM node:16.16.0-alpine

WORKDIR /app

COPY --from=builder /app ./

CMD ["npm", "run", "--prefix", "/app/auth-service", "start:prod"]