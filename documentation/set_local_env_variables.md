### This guide will walk you through setting local env variables and explain what are the used for

1. All the env variables handled by config-service
2. Go to [services/config-service](../services/config-service)
3. There is example `env.example` file
4. Create `.env` file and set all the following variables to be loaded to the `config-service`
    * `RABBIT_MQ_*_QUEUE` - rabbit mq queue names
    * `RABBIT_MQ_USER` - user rabbit credential
    * `RABBIT_MQ_PASS` - pass rabbit credential
    * `RABBIT_MQ_HOST` - host rabbit credential
    * `VULTR_UPLOAD_BUCKET` - vultr object storage bucket name. [Guide to get this variable](./guides/vultr_upload_bucket.md)
    * `VULTR_STORAGE_HOSTNAME` - vultr object storage hostname, used to allow download assets from frontend [Guide to get this variable](./guides/vultr_storage_hostname.md)
    * `VULTR_SECRET_ACCESS_KEY` - vultr object storage secret key [Guide to get this variable](./guides/vultr_keys.md)
    * `VULTR_ACCESS_KEY` - vultr object storage access key [Guide to get this variable](./guides/vultr_keys.md)
    * `VULTR_API_KEY` - vultr cloud provider api key to make api requests in `scaling-service` [Guide to get this variable](./guides/vultr_api_key.md)
    * `VULTR_SNAPSHOT_ID` - snapshot id used for creating meeting instances with livekit media server [Guide to get this variable](./guides/vultr_snapshot.md)
    * `LIVEKIT_API_KEY`
    * `LIVEKIT_API_SECRET`
    * `LIVEKIT_HOST`
    * `STRIPE_WEBHOOK_SECRET`
    * `STRIPE_EXPRESS_WEBHOOK_SECRET`
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
    * `SMTP_USER_NAME`
    * `MANDRILL_API_KEY`
    * `EMAIL_SERVICE`
    * `SUPPORT_SCALING` - this variable responsible for monitoring vultr instances