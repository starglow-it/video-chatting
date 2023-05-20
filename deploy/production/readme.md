
```shell
# down
docker-compose -f docker-compose.proxy.yml down --remove-orphans

docker-compose -f docker-compose.services.yml down --remove-orphans


```

- temp
```shell

```


###### setup action-runner
```shell
mkdir /srv
export RUNNER_ALLOW_RUNASROOT="1"
cd /srv
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.303.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.303.0/actions-runner-linux-x64-2.303.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.303.0.tar.gz
./config.sh --url https://github.com/anhtuan57.click/tlo --token APVBWUL5OYU436YSPEOGLG3ELUV3O --labels liveofficeProd --name liveofficeProd --runnergroup Default --work _work
sudo ./svc.sh install

```

###### operate action-runner
```shell
cd /srv/actions-runner
# operation runner
sudo ./svc.sh start
sudo ./svc.sh status
sudo ./svc.sh stop
# uninstall runner
sudo ./svc.sh uninstall

# remove token of runner
./config.sh remove --token APVBWUL5OYU436YSPEOGLG3ELUV3O

```

###### migrate
```shell
# backup
docker exec production_mongodb rm -rf /data/db/tlo-backup
docker exec production_mongodb mongodump -d theliveoffice -o /data/db/tlo-backup
scp -r /data/liveoffice/mongo/tlo-backup root@18.118.59.1:/data/liveoffice/mongo/tlo-backup


production_mongodb
# drop db
docker exec services-mongo-1 mongo --eval 'db.dropDatabase();' theliveoffice 

# restore
#mongorestore -d theliveoffice /data/db/tlo-backup/theliveoffice
docker exec services-mongo-1 mongorestore -d theliveoffice /data/db/tlo-backup/theliveoffice



```