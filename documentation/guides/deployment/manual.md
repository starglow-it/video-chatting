# Manual deployment
1. Clone the project to the server
2. Deploy the project
- Staging
```shell
$ cd deploy/staging

# Update Traefik
$ docker-compose -f docker-compose.proxy.yml up -d --build --force-recreate --remove-orphans

# Deploy new source
$ docker-compose -f docker-compose.services.yml up -d --build --remove-orphans
```
- Production
```shell
$ cd deploy/production

# Update Traefik
$ docker-compose -f docker-compose.proxy.yml up -d --build --force-recreate --remove-orphans

# Deploy new source
$ docker-compose -f docker-compose.services.yml up -d --build --remove-orphans
```