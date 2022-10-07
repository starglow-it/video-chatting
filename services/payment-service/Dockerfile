FROM node:18.7.0-alpine AS builder

WORKDIR /app

COPY ./shared ./shared

RUN mkdir ./payment-service

COPY ./payment-service/package*.json ./payment-service/

RUN npm ci --legacy-peer-deps --silent --force --prefix=/app/payment-service

COPY ./payment-service ./payment-service/

RUN npm run build --prefix=/app/payment-service

FROM node:18.7.0-alpine

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 5000

CMD /wait && npm run start:prod --prefix=/app/payment-service

