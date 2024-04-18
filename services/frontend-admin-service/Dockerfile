FROM node:18.9.1-alpine as builder

ARG VULTR_STORAGE_HOSTNAME
ENV VULTR_STORAGE_HOSTNAME=$VULTR_STORAGE_HOSTNAME

RUN apk add --no-cache curl && curl -sL https://unpkg.com/@pnpm/self-installer | node

WORKDIR /app

RUN mkdir -p services/frontend-admin-service

COPY ./pnpm-workspace.yaml ./
COPY ./.npmrc ./
COPY ./shared ./shared

RUN pnpm add nx -D -w

COPY ./services/frontend-admin-service/package.json ./services/frontend-admin-service

RUN pnpm install

COPY ./services/frontend-admin-service ./services/frontend-admin-service

RUN npx nx run-many --target=build --projects=shared-const,shared-utils,shared-types,frontend-admin-service

FROM node:18.9.1-alpine

RUN apk add --no-cache curl && curl -sL https://unpkg.com/@pnpm/self-installer | node

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 9000

CMD /wait && pnpm --filter frontend-admin-service start