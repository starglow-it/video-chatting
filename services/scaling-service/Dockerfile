FROM node:18.7.0-alpine AS builder

WORKDIR /app

COPY ./shared ./shared

RUN mkdir ./scaling-service

COPY ./scaling-service/package*.json ./scaling-service/

RUN npm ci --legacy-peer-deps --silnt --force --prefix=/app/scaling-service

COPY ./scaling-service ./scaling-service/

RUN npm run build --prefix=/app/scaling-service

FROM node:18.7.0-alpine

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 6000

CMD /wait && npm run start:prod --prefix=/app/scaling-service

