#!/bin/bash

list=("$@")

for var in "${list[@]}"; do
    docker stop $var-service
    docker rm -f $var-service
    docker rmi -f local-$var-service
    docker volume prune -f
    docker-compose up --build -d $var-service
done

#example: if you want to build core service, gateway service:
#command: bash rebuild.sh core gateway
