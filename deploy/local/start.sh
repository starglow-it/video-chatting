#!bin/bash
docker system prune -a -f
bash core-service-rebuild.sh
bash auth-service-rebuild.sh
bash gateway-service-rebuild.sh
bash frontend-service-rebuild.sh
bash payment-service-rebuild.sh
bash media-server-service-rebuild.sh
bash frontend-service-rebuild.sh