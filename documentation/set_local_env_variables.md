### This guide will walk you through setting local env variables and explain what are the used for

1. All the env variables handled by config-service
2. Go to [services/config-service](../services/config-service)
3. There is example `env.example` file
4. Create `.env` file and set all the following variables to be loaded to the `config-service`
    * `RABBIT_MQ_*_QUEUE` - rabbit mq queue names
    * `RABBIT_MQ_USER` - user rabbit credential
    * `RABBIT_MQ_PASS` - pass rabbit credential
    * `RABBIT_MQ_HOST` - host rabbit credential
    * `VULTR_UPLOAD_BUCKET` - vultr object storage bucket name. [Guide to get this variable](./guides/vultr/vultr_upload_bucket.md)
    * `VULTR_STORAGE_HOSTNAME` - vultr object storage hostname, used to allow download assets from frontend [Guide to get this variable](./guides/vultr/vultr_storage_hostname.md)
    * `VULTR_SECRET_ACCESS_KEY` - vultr object storage secret key [Guide to get this variable](./guides/vultr/vultr_keys.md)
    * `VULTR_ACCESS_KEY` - vultr object storage access key [Guide to get this variable](./guides/vultr/vultr_keys.md)
    * `VULTR_API_KEY` - vultr cloud provider api key to make api requests in `scaling-service` [Guide to get this variable](./guides/vultr/vultr_api_key.md)
    * `VULTR_SNAPSHOT_ID` - snapshot id used for creating meeting instances with livekit media server [Guide to get this variable](./guides/vultr/vultr_snapshot.md)
    * `LIVEKIT_API_KEY` - api key used to authorize connection [Guide to get this variable](./guides/livekit/livekit_keys.md)
    * `LIVEKIT_API_SECRET` - secret key used to authorize connection [Guide to get this variable](./guides/livekit/livekit_keys.md)
    * `LIVEKIT_HOST` - url that used in media-server-service to connect to livekit service
    * `STRIPE_WEBHOOK_SECRET` - used to verify webhooks [Guide to get this variable](./guides/stripe/webhooks.md)
    * `STRIPE_EXPRESS_WEBHOOK_SECRET`- used to verify express webhooks [Guide to get this variable](./guides/stripe/webhooks.md)
    * `STRIPE_API_KEY`
    * `ENVIRONMENT`
    * `IS_LOCAL`
    * `PORT`
    * `NODE_ENV`
    * `DEFAULT_SERVER_IP`
    * `DEFAULT_DOMAIN`
    * `FRONTEND_URL`
    * `GATEWAY_PORT`
    * `JWT_SECRET`
    * `MONGO_URI`
    * `SMTP_USER`
    * `SMTP_PASS`
    * `SMTP_USER_NAME`
    * `MANDRILL_API_KEY`
    * `EMAIL_SERVICE` - email service that will be used to send messages
    * `SUPPORT_SCALING` - this variable responsible for monitoring vultr instances
    * `SUPPORT_EMAIL`