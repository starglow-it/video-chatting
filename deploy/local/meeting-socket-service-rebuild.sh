#!bin/bash
docker stop meeting-socket-service
docker rm -f meeting-socket-service
docker rmi -f local-meeting-socket-service
docker volume prune -f
docker-compose up --build -d meeting-socket-service