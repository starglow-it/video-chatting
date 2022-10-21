export interface IConfig {
  rabbitMqCoreQueue: string;
  rabbitMqAuthQueue: string;
  rabbitMqSocketQueue: string;
  rabbitMqNotificationsQueue: string;
  rabbitMqMediaServerQueue: string;
  rabbitMqScalingQueue: string;
  rabbitMqPaymentQueue: string;
  rabbitMqUser: string;
  rabbitMqPass: string;
  rabbitMqHost: string;
  rabbitMqCoreHost: string;
  rabbitMqCorePort: string;

  stripeApiKey: string;
  stripeWebhookSecret: string;
  stripeExpressWebhookSecret: string;

  livekitApiKey: string;
  livekitApiSecret: string;
  livekitHost: string;

  vultrStorageHostname: string;
  vultrUploadBucket: string;
  vultrSnapshotId: string;
  vultrApiKey: string;
  vultrAccessKey: string;
  vultrSecretAccessKey: string;

  mongoUri: string;
  jwtSecret: string;
  frontendUrl: string;
  gatewayPort: string;
  smtpUser: string;
  smtpPass: string;
  smtpUserName: string;
  defaultServerIp: string;
  defaultDomain: string;
  mandrillApiKey: string;
  isLocal: string;
  nodeEnv: string;
  port: string;
  emailService: string;
  environment: string;
  supportScaling: boolean;
  numberOfActiveServers: number;
  supportEmail: string;
  adminEmail: string;
  adminPassword: string;
}

export type ConfigKeysType = keyof IConfig;

