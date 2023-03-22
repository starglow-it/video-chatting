#!bin/bash
docker stop config-service
docker rm -f config-service
docker rmi -f local-config-service
docker-compose up -d --build config-service