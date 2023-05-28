FROM coturn/coturn:latest

#RUN apt update && apt-get install -y curl iproute2

COPY ./turnserver.conf ./etc/turnserver.conf

#RUN internalIp="$(ip a | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1')"
# RUN externalIp="$(dig +short myip.opendns.com @resolver1.opendns.com)"

# RUN sed -i "s/turndomainstub/$TURN_URL/g" /etc/turnserver.conf
#RUN sed -i "s/relay_ip/$internalIp/g" /etc/turnserver.conf
# RUN sed -i "s/externalipstub/$externalIp/g" /etc/turnserver.conf

CMD turnserver -c etc/turnserver.conf
