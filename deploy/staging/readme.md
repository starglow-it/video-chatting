
```shell
docker-compose --compatibility -p liveoffice -f docker-compose.traefik.yml up -d --build --force-recreate --remove-orphans

docker-compose --compatibility -p liveoffice_demo -f docker-compose.demo.yml up -d --build --remove-orphans


# down
docker-compose --compatibility -p liveoffice -f docker-compose.traefik.yml down

docker-compose --compatibility -p liveoffice_demo -f docker-compose.demo.yml down

```

