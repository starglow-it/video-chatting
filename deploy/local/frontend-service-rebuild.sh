#!bin/bash
docker stop frontend-service
docker rm -f frontend-service
docker-compose up -d --build frontend-service