#!bin/bash
docker stop core-service
docker rm -f core-service
docker rmi -f local-core-service
docker volume prune
docker-compose up -d --build core-service