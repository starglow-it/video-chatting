#!bin/bash
docker stop meeting-socket-service
docker rm -f meeting-socket-service
docker-compose up -d --build meeting-socket-service