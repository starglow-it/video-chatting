FROM node:18.7.0-alpine AS builder

WORKDIR /app

COPY ./shared ./shared

RUN mkdir ./socket-service

COPY ./socket-service/package*.json ./socket-service/

RUN npm ci --silent --legacy-peer-deps --prefix=/app/socket-service

COPY ./socket-service ./socket-service/

RUN npm run build --prefix=/app/socket-service

FROM node:18.7.0-alpine

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 8080

CMD /wait && npm run start:prod --prefix=/app/socket-service
