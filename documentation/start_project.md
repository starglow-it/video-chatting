To start project locally

```shell
$ cd ./deploy/local
# Run all services
$ docker-compose up -d --build
# Run specified services
# Example: If you want to build core service, gateway service:
# Run: bash rebuild.sh core gateway
$ bash rebuild.sh <specified services>
```