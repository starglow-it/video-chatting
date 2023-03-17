#!bin/bash
docker stop config-service
docker rm -f config-service
docker-compose up -d --build config-service