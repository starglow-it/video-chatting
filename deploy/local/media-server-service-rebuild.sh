#!bin/bash
docker stop media-server-service
docker rm -f media-server-service
docker rmi -f local-media-server-service
docker volume prune -f
docker-compose up --build -d media-server-service