#!bin/bash
docker stop config-service
docker rm -f config-service
docker rmi -f local-config-service
docker volume prune
docker-compose up --build -d config-service