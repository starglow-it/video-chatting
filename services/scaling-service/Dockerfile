FROM node:18.9.1-alpine AS builder

RUN apk add --no-cache curl && curl -sL https://unpkg.com/@pnpm/self-installer | node

WORKDIR /app

RUN mkdir -p services/scaling-service

COPY ./pnpm-workspace.yaml ./
COPY ./.npmrc ./
COPY ./shared ./shared

RUN pnpm add nx -D -w

COPY ./services/scaling-service/package.json ./services/scaling-service

RUN pnpm install

COPY ./services/scaling-service ./services/scaling-service

RUN npx nx run-many --target=build --projects=shared-const,shared,scaling-service

FROM node:18.9.1-alpine

RUN apk add --no-cache curl && curl -sL https://unpkg.com/@pnpm/self-installer | node

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 6000

CMD /wait && pnpm --filter scaling-service start:prod

