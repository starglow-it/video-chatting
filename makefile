export SERVICE_NAME?="gateway-service"
export SHELL_COMMAND?=${SHELL}
exec-service:
	docker exec -it ${SERVICE_NAME} ${SHELL_COMMAND}

log-service:
	docker logs -f ${SERVICE_NAME}

build-service:
	cd deploy/local && \
	docker stop ${SERVICE_NAME} || \
    docker rm -f ${SERVICE_NAME} || \
    docker rmi -f local-${SERVICE_NAME} || \
    docker volume prune -f && \
    docker-compose up --build -d ${SERVICE_NAME} \
	