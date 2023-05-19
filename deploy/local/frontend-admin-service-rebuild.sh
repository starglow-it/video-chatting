#!bin/bash
docker stop frontend-admin-service
docker rm -f frontend-admin-service
docker rmi -f local-frontend-admin-service
docker volume prune -f
docker-compose up --build -d frontend-admin-service