export interface IConfig {
    rabbitMqCoreQueue: string;
    rabbitMqAuthQueue: string;
    rabbitMqNotificationsQueue: string;
    rabbitMqPaymentQueue: string;
    rabbitMqUser: string;
    rabbitMqPass: string;
    rabbitMqHost: string;
    mongoUri: string;
    jwtSecret: string;
    frontendUrl: string;
    gatewayPort: string;
    smtpUser: string;
    smtpPass: string;
    smtpUserName: string;
    defaultServerIp: string;
    appId: string;
    appCertificate: string;
    accessKey: string;
    secretAccessKey: string;
    uploadBucket: string;
    storageHostname: string;
    stripeApiKey: string;
    stripeWebhookSecret: string;
    stripeExpressWebhookSecret: string;
    mandrillApiKey: string;
    isLocal: string;
    nodeEnv: string;
    port: string;
    emailService: string;
}

export type ConfigKeysType = keyof IConfig;
