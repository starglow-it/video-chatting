
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
export RUNNER_ALLOW_RUNASROOT="1"
cd /src
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.303.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.303.0/actions-runner-linux-x64-2.303.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.303.0.tar.gz
./config.sh --url https://github.com/nongdan-dev/tlo --token APVBWULGCJD3FYWD7ZQKHODELURIS --labels liveofficeStaging --name liveofficeProd --runnergroup Default --work _work
sudo ./svc.sh install

```

###### operate action-runner
```shell
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