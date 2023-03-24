#!bin/bash
docker stop frontend-service
docker rm -f frontend-service
docker rmi -f local-frontend-service
docker volume prune
docker-compose up --build -d frontend-service