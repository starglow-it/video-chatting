#!bin/bash
docker stop auth-service
docker rm -f auth-service
docker rmi -f local-auth-service
docker volume prune
docker-compose up --build -d auth-service
