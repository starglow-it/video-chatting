FROM node:16.16.0-alpine AS builder

WORKDIR /app

COPY ./shared ./shared

RUN mkdir ./socket-service

COPY ./socket-service/package.json ./socket-service/

RUN cd ./socket-service && npm i --legacy-peer-deps

COPY ./socket-service ./socket-service/

RUN cd ./socket-service && npm run build

FROM node:16.16.0-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 8080

CMD ["npm", "run", "--prefix", "/app/socket-service", "start:prod"]