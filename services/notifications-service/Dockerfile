FROM node:18.7.0-alpine AS builder

RUN apk update
RUN apk upgrade
RUN apk add --no-cache git

WORKDIR /app

COPY ./shared ./shared

RUN mkdir ./notifications-service

COPY ./notifications-service/package*.json ./notifications-service/

RUN npm ci --legacy-peer-deps --silent --prefix=/app/notifications-service

COPY ./notifications-service ./notifications-service/

RUN npm run build --prefix=/app/notifications-service

FROM node:18.7.0-alpine

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

WORKDIR /app

COPY --from=builder /app ./

CMD /wait && npm run start --prefix=/app/notifications-service
