FROM node:16.14.0-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . ./

RUN npm run build

FROM node:16.14.0-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 8000

CMD ["npm", "run", "start"]