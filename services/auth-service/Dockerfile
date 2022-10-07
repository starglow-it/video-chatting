FROM node:18.7.0-alpine AS builder

WORKDIR /app

COPY ./shared ./shared

RUN mkdir ./auth-service

COPY ./auth-service/package*.json ./auth-service/

RUN npm ci --legacy-peer-deps --silent --prefix=/app/auth-service

COPY ./auth-service ./auth-service/

RUN npm run build --prefix=/app/auth-service

FROM node:18.7.0-alpine

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

WORKDIR /app

COPY --from=builder /app ./

CMD /wait && npm run start:prod --prefix=/app/auth-service