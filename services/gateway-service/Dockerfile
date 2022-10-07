FROM node:18.7.0-alpine AS builder

WORKDIR /app

COPY ./shared ./shared

RUN mkdir ./gateway-service

COPY ./gateway-service/package*.json ./gateway-service/

RUN npm ci --silent --legacy-peer-deps --prefix=/app/gateway-service

COPY ./gateway-service ./gateway-service/

RUN npm run build --prefix=/app/gateway-service

FROM node:18.7.0-alpine

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD /wait && npm run start:prod --prefix=/app/gateway-service
