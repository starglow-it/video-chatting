
```shell
docker-compose -f docker-compose.proxy.yml up -d --build --force-recreate --remove-orphans

rsync -av env /srv/tlo/services/config-service/.env
docker-compose -f docker-compose.services.yml up -d --build --remove-orphans

# down
docker-compose --compatibility -p liveoffice -f docker-compose.traefik.yml down

docker-compose --compatibility -p liveoffice_staging -f docker-compose.staging.yml down

```

- temp
```shell

docker-compose --compatibility -p liveoffice -f docker-compose.traefik.yml down --remove-orphans; docker ps

docker-compose --compatibility -p liveoffice -f docker-compose.traefik.yml up --build --force-recreate --remove-orphans

docker-compose --compatibility -p liveoffice_staging -f docker-compose.staging.yml up --build --remove-orphans

# meeting-socket-service
docker-compose --compatibility -p liveoffice_staging -f docker-compose.staging.yml build  --no-cache meeting-socket-service
docker-compose --compatibility -p liveoffice_staging -f docker-compose.staging.yml up -d  --remove-orphans meeting-socket-service

# frontend
docker-compose --compatibility -p liveoffice_staging -f docker-compose.staging.yml  build  --no-cache frontend-service
docker-compose --compatibility -p liveoffice_staging -f docker-compose.staging.yml up -d  --remove-orphans frontend-service


# config-service
docker-compose --compatibility -p liveoffice_staging -f docker-compose.staging.yml  build  --no-cache config-service
docker-compose --compatibility -p liveoffice_staging -f docker-compose.staging.yml up -d  --remove-orphans config-service


# livekit-service
docker-compose --compatibility -p liveoffice_staging -f docker-compose.staging.yml  build  --no-cache livekit-service
docker-compose --compatibility -p liveoffice_staging -f docker-compose.staging.yml up -d  --remove-orphans livekit-service


# get all configuration
docker exec -it liveoffice_staging_frontend curl http://config-service:4000/v1/config



```

###### setup action-runner
```shell

```