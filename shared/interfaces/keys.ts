import { ConfigKeysType } from './config.interface';

export const ConfigKeys: readonly ConfigKeysType[] = [
    'rabbitMqCoreQueue',
    'rabbitMqAuthQueue',
    'rabbitMqNotificationsQueue',
    'rabbitMqInstanceMangerQueue',
    'rabbitMqUser',
    'rabbitMqPass',
    'rabbitMqHost',
    'mongoUri',
    'jwtSecret',
    'frontendUrl',
    'gatewayPort',
    'smtpHost',
    'smtpPort',
    'smtpUser',
    'smtpPass',
    'defaultServerIp',
    'appId',
    'appCertificate',
    'uploadBucket',
    'storageHostname',
    'accessKey',
    'secretAccessKey'
];
