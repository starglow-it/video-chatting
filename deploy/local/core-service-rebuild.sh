#!bin/bash
docker stop core-service
docker rm -f core-service
docker-compose up -d --build core-service