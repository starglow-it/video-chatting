FROM traefik:v2.9

WORKDIR /traefik

COPY ./traefik.yml ./traefik.yml
COPY ./dynamic_conf.yml ./dynamic_conf.yml

CMD ["traefik"]
