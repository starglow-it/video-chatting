FROM node:18.9.1-alpine AS builder

RUN apk add --no-cache curl && curl -L https://raw.githubusercontent.com/pnpm/self-installer/master/install.js | PNPM_VERSION=8.15.5 node

RUN apk update
RUN apk upgrade
RUN apk add --no-cache git
RUN apk add --no-cache python3 py3-pip
RUN apk add --no-cache g++ make

WORKDIR /app

RUN mkdir -p services/media-server-service

COPY ./pnpm-workspace.yaml ./
COPY ./.npmrc ./
COPY ./shared ./shared

RUN pnpm add nx -D -w

COPY ./services/media-server-service/package.json ./services/media-server-service

COPY ./services/media-server-service ./services/media-server-service

RUN pnpm install

RUN npx nx run-many --target=build --projects=shared-utils,shared-const,shared-types,media-server-service

FROM node:18.9.1-alpine

RUN apk add --no-cache curl && curl -L https://raw.githubusercontent.com/pnpm/self-installer/master/install.js | PNPM_VERSION=8.15.5 node

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 9091

CMD /wait && pnpm --filter media-server-service start
