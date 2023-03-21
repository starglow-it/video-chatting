#!bin/bash
docker stop gateway-service
docker rm -f gateway-service
docker-compose up -d --build gateway-service