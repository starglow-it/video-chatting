FROM node:18.9.1-alpine as builder

ARG VULTR_STORAGE_HOSTNAME
ENV VULTR_STORAGE_HOSTNAME=$VULTR_STORAGE_HOSTNAME

RUN apk add --no-cache curl && curl -L https://raw.githubusercontent.com/pnpm/self-installer/master/install.js | PNPM_VERSION=8.15.5 node

WORKDIR /app

RUN mkdir -p services/frontend-service

COPY ./pnpm-workspace.yaml ./
COPY ./.npmrc ./
COPY ./shared ./shared

RUN pnpm add nx -D -w

COPY ./services/frontend-service/package.json ./services/frontend-service

RUN pnpm install

COPY ./services/frontend-service ./services/frontend-service

RUN npx nx run-many --target=build --projects=shared-const,shared-utils,shared-types,frontend-service

FROM node:18.9.1-alpine

RUN apk add --no-cache curl && curl -L https://raw.githubusercontent.com/pnpm/self-installer/master/install.js | PNPM_VERSION=8.15.5 node

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 9000

CMD /wait && pnpm --filter frontend-service start