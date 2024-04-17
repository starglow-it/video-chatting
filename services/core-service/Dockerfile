FROM node:18.12.0-alpine AS builder

RUN apk add --no-cache curl && curl -sL https://unpkg.com/@pnpm/self-installer | node

WORKDIR /app

RUN mkdir -p services/core-service

COPY ./pnpm-workspace.yaml ./
COPY ./.npmrc ./
COPY ./shared ./shared

RUN pnpm add nx -D -w

COPY ./services/core-service/package.json ./services/core-service

RUN pnpm install

COPY ./services/core-service ./services/core-service

RUN npx nx run-many --target=build --projects=shared-types,shared-const,shared-utils,core-service

FROM node:18.12.0-alpine

RUN apk add --no-cache curl && curl -sL https://unpkg.com/@pnpm/self-installer | node

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

RUN apk update
RUN apk add ffmpeg

WORKDIR /app

COPY --from=builder /app ./

CMD /wait && pnpm --filter core-service start:prod
