
```shell
# down
sudo docker-compose -f docker-compose.proxy.yml down --remove-orphans

docker-compose -f docker-compose.services.yml down --remove-orphans

sudo docker-compose -f docker-compose.proxy.yml up -d
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
export RUNNER_ALLOW_RUNASROOT="1"
cd /src
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.303.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.303.0/actions-runner-linux-x64-2.303.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.303.0.tar.gz
./config.sh --url https://github.com/nongdan-dev/tlo --token APVBWUPUULB7BY67QKNT5CDEEULSG --labels liveofficeStaging --name liveofficeStaging --runnergroup Default --work _work
sudo ./svc.sh install

cd /src/actions-runner
# operation runner
sudo ./svc.sh start
sudo ./svc.sh status
sudo ./svc.sh stop
# uninstall runner
sudo ./svc.sh uninstall

# remove token of runner
./config.sh remove --token <APVBWUPUULB7BY67QKNT5CDEEULSG>

```


###### migrate
```shell
# backup
docker exec services-mongo-1 rm -rf /data/db/tlo-backup
docker exec services-mongo-1 mongodump -d theliveoffice -o /data/db/tlo-backup
scp -r /data/liveoffice/mongo/tlo-backup root@3.129.50.243:/data/liveoffice/mongo/tlo-backup


new mongodb
# drop db
docker exec services-mongo-1 mongo --eval 'db.dropDatabase();' theliveoffice 

# restore
#mongorestore -d theliveoffice /data/db/tlo-backup/theliveoffice
docker exec services-mongo-1 mongorestore -d theliveoffice /data/db/tlo-backup/theliveoffice


sudo docker-compose -f docker-compose.proxy.yml down
sudo docker network rm traefikpublic
docker network inspect traefikpublic
sudo docker network inspect traefikpublic
docker network disconnect traefikpublic
sudo docker network disconnect traefikpublic 4e01df01698a651449ea0cb9f3fe94bd2da59e68611dff1d47f86fa6dea73733
sudo docker-compose -f docker-compose.proxy.yml up -d

```