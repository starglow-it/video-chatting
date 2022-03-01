FROM alpine:3.10

WORKDIR /app
ADD . /app

EXPOSE 3478

RUN apk update && apk add bind-tools coturn curl && rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["sh", "deploy-turnserver.sh"]
