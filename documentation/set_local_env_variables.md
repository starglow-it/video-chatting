### This guide will walk you through setting local env variables and explain what are the used for

1. All the env variables handled by config-service
2. Go to [deploy/local](../deploy/local/)
3. There is example `.env.example` file
4. Create `.env` file and set all the following variables to be loaded to the `local`
    * `RABBIT_MQ_*_QUEUE` - rabbit mq queue names
    * `RABBIT_MQ_USER` - user rabbit credential
    * `RABBIT_MQ_PASS` - pass rabbit credential
    * `RABBIT_MQ_HOST` - host rabbit credential
    * `VULTR_UPLOAD_BUCKET`
    * `VULTR_STORAGE_HOSTNAME`
    * `VULTR_SECRET_ACCESS_KEY`
    * `VULTR_ACCESS_KEY`
    * `VULTR_API_KEY`
    * `VULTR_SNAPSHOT_ID`
    * `LIVEKIT_API_KEY` - api key used to authorize connection [Guide to get this variable](./guides/livekit/livekit_keys.md)
    * `LIVEKIT_API_SECRET` - secret key used to authorize connection [Guide to get this variable](./guides/livekit/livekit_keys.md)
    * `LIVEKIT_HOST` - url that used in media-server-service to connect to livekit service
    * `STRIPE_WEBHOOK_SECRET` - used to verify webhooks [Guide to get this variable](./guides/stripe/webhooks.md)
    * `STRIPE_EXPRESS_WEBHOOK_SECRET`- used to verify express webhooks [Guide to get this variable](./guides/stripe/webhooks.md)
    * `STRIPE_API_KEY`
    * `STRIPE_PUBLIC_API_KEY`
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
    * `ADMIN_EMAIL`
    * `ADMIN_PASSWORD`
    * `GEOLOCATION_API_KEY`
    * `GOOGLE_CLIENT_ID`
    * `GOOGLE_SECRET`
    * `TURN_PORT`
    * `TURN_URL`
    * `TURN_USERNAME`
    * `IS_SYNC_DATA` - If it is set to true, the records will have their fields synchronized according to the schema
    * `IS_SEED` - If it is set to true, the seeding function will work
    * `FRONTEND_ADMIN_URL`
    * `INNER_FRONTEND_ADMIN_PORT`
