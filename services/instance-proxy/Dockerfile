FROM nginx:latest

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 7000/tcp

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]