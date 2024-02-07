# Manual deployment
1. Clone the project to the server
2. Create branches to deploy
- Staging env: `staging`
- Production env: `production`
3. Deploy the project
- Staging
```shell
$ git checkout staging
$ cd deploy/staging

# Update Traefik
$ docker-compose -f docker-compose.proxy.yml up -d --build --force-recreate --remove-orphans

# Deploy new source
$ docker-compose -f docker-compose.services.yml up -d --build --remove-orphans
```
- Production
```shell
$ git checkout production
$ cd deploy/production

# Update Traefik
$ docker-compose -f docker-compose.proxy.yml up -d --build --force-recreate --remove-orphans

# Deploy new source
$ docker-compose -f docker-compose.services.yml up -d --build --remove-orphans
```