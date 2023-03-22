#!bin/bash
docker stop gateway-service
docker rm -f gateway-service
docker rmi -f local-gateway-service
docker-compose up --build -d gateway-service