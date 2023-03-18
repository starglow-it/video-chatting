#!bin/bash
docker stop frontend-admin-service
docker rm -f frontend-admin-service
docker-compose up -d --build frontend-admin-service