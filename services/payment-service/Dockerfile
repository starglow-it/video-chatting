FROM node:18.9.1-alpine AS builder

RUN apk add --no-cache curl && curl -L https://raw.githubusercontent.com/pnpm/self-installer/master/install.js | PNPM_VERSION=8.15.5 node

WORKDIR /app

RUN mkdir -p services/payment-service

COPY ./pnpm-workspace.yaml ./
COPY ./.npmrc ./
COPY ./shared ./shared

RUN pnpm add nx -D -w

COPY ./services/payment-service/package.json ./services/payment-service

COPY ./services/payment-service ./services/payment-service

RUN pnpm install

RUN npx nx run-many --target=build --projects=shared-types,shared-const,shared-utils,payment-service

FROM node:18.9.1-alpine

RUN apk add --no-cache curl && curl -L https://raw.githubusercontent.com/pnpm/self-installer/master/install.js | PNPM_VERSION=8.15.5 node

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 5000

CMD /wait &&  pnpm --filter payment-service start:prod

