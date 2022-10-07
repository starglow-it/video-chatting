FROM node:18.7.0-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps --force

COPY . ./

RUN npm run build

FROM node:18.7.0-alpine

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 8000

CMD /wait && npm run start