export interface IConfig {
    rabbitMqCoreQueue: string;
    rabbitMqAuthQueue: string;
    rabbitMqNotificationsQueue: string;
    rabbitMqInstanceMangerQueue: string;
    rabbitMqUser: string;
    rabbitMqPass: string;
    rabbitMqHost: string;
    mongoUri: string;
    jwtSecret: string;
    frontendUrl: string;
    gatewayPort: string;
    smtpHost: string;
    smtpPort: string;
    smtpUser: string;
    smtpPass: string;
    defaultServerIp: string;
    appId: string;
    appCertificate: string;
    accessKey: string;
    secretAccessKey: string;
    uploadBucket: string;
    storageHostname: string
}

export type ConfigKeysType = keyof IConfig;
