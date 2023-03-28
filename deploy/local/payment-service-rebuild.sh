#!bin/bash
docker stop payment-service
docker rm -f payment-service
docker rmi -f local-payment-service
docker volume prune
docker-compose up --build -d payment-service