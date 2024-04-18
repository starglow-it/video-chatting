FROM node:18.9.1-alpine AS builder

RUN apk add --no-cache curl && curl -L https://raw.githubusercontent.com/pnpm/self-installer/master/install.js | PNPM_VERSION=8.15.5 node

WORKDIR /app

RUN mkdir -p services/config-service

COPY ./pnpm-workspace.yaml ./
COPY ./.npmrc ./
COPY ./shared ./shared

RUN pnpm add nx -D -w

COPY ./services/config-service/package.json ./services/config-service

RUN pnpm install

COPY ./services/config-service ./services/config-service

RUN npx nx run-many --target=build --projects=shared-utils,shared-const,shared-types,config-service

FROM node:18.9.1-alpine

RUN apk add --no-cache curl && curl -L https://raw.githubusercontent.com/pnpm/self-installer/master/install.js | PNPM_VERSION=8.15.5 node

WORKDIR /app

COPY --from=builder /app ./

CMD ["pnpm", "--filter", "config-service", "start"]
