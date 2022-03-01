#!/bin/sh

rm -rf /etc/turnserver.conf

USER="$1"
PASS="$2"
REALM="${3:-realm}"

echo "user=$USER"
echo "pass=$PASS"
echo "realm=$REALM"

internalIp="$(ip a | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1')"
externalIp="$(dig +short myip.opendns.com @resolver1.opendns.com)"

echo "Internal IP: $internalIp"
echo "External IP: $externalIp"

(
cat <<EOF
listening-port=3478
tls-listening-port=5349
listening-ip=$internalIp
relay-ip=$internalIp
external-ip=$externalIp
realm=$REALM
server-name=$REALM
lt-cred-mech
# use real-valid certificate/privatekey files
cert=/etc/ssl/turn_server_cert.pem
pkey=/etc/ssl/turn_server_pkey.pem

no-stdout-log
user=$USER:$PASS
realm=$REALM
EOF
) > /etc/turnserver.conf

turnserver

echo "TURN server running"
