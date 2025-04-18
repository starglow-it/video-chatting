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
  googleClientId: string;
  googleSecret: string;
  apiVersion: string;
  appVersion: string;
  isSyncData: boolean;
  isSeed: boolean;
  mediaServicePort: string;
  geolocationApiKey: string;
  openaiUrl: string;
  openaiApiKey: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
}

export type ConfigKeysType = keyof IConfig;

export const ConfigKeys: readonly ConfigKeysType[] = [
  'rabbitMqCoreQueue',
  'rabbitMqSocketQueue',
  'rabbitMqAuthQueue',
  'rabbitMqNotificationsQueue',
  'rabbitMqMediaServerQueue',
  'rabbitMqScalingQueue',
  'rabbitMqPaymentQueue',
  'rabbitMqUser',
  'rabbitMqPass',
  'rabbitMqHost',
  'rabbitMqCoreHost',
  'rabbitMqCorePort',

  'vultrUploadBucket',
  'vultrStorageHostname',
  'vultrAccessKey',
  'vultrSecretAccessKey',
  'vultrSnapshotId',
  'vultrApiKey',

  'stripeApiKey',
  'stripeWebhookSecret',
  'stripeExpressWebhookSecret',

  'livekitApiKey',
  'livekitApiSecret',
  'livekitHost',

  'environment',
  'isLocal',
  'port',
  'nodeEnv',
  'emailService',
  'defaultServerIp',
  'defaultDomain',
  'frontendUrl',
  'gatewayPort',
  'jwtSecret',
  'mongoUri',
  'smtpUser',
  'smtpPass',
  'smtpUserName',
  'mandrillApiKey',
  'supportScaling',
  'numberOfActiveServers',
  'supportEmail',
  'adminEmail',
  'adminPassword',
  'googleClientId',
  'googleSecret',
  'apiVersion',
  'appVersion',
  'isSyncData',
  'isSeed',
  'mediaServicePort',
  'geolocationApiKey',
  'openaiUrl',
  'openaiApiKey',
  'awsAccessKeyId',
  'awsSecretAccessKey',
];

export const DefaultConfigValues: Record<
  ConfigKeysType,
  string | number | boolean
> = {
  rabbitMqCoreQueue: 'rabbitMqCoreQueue',
  rabbitMqSocketQueue: 'rabbitMqSocketQueue',
  rabbitMqAuthQueue: 'rabbitMqAuthQueue',
  rabbitMqNotificationsQueue: 'rabbitMqNotificationsQueue',
  rabbitMqMediaServerQueue: 'rabbitMqMediaServerQueue',
  rabbitMqScalingQueue: 'rabbitMqScalingQueue',
  rabbitMqPaymentQueue: 'rabbitMqPaymentQueue',
  rabbitMqUser: 'rabbituser',
  rabbitMqPass: 'rabbitpass',
  rabbitMqHost: 'rabbitmq',
  rabbitMqCoreHost: 'rabbitmq',
  rabbitMqCorePort: '5672',
  mongoUri: 'mongodb://mongo:27017/theliveoffice',
  jwtSecret: 'jwtSecret',
  frontendUrl: 'http://localhost:8000',
  gatewayPort: '3000',
  smtpUser: 'vladislav.e@fora-soft.com',
  smtpPass: 'xoiwmfwquupyhcoj',
  smtpUserName: 'The LiveOffice',
  defaultServerIp: 'localhost',
  defaultDomain: 'localhost',
  vultrUploadBucket: 'liveoffice',
  vultrStorageHostname: 'ewr1.vultrobjects.com',
  vultrAccessKey: 'XSGnjAdSXoRYhTAntNNJYhHCY7MeJseUujCDvcHK',
  vultrSecretAccessKey: '04F4BOA4E0QRBSF0BW37',
  vultrSnapshotId: '',
  vultrApiKey: '',
  livekitApiKey: 'apikey',
  livekitApiSecret: 'apisecret',
  livekitHost: 'http://localhost:7880',
  stripeApiKey: '',
  stripeWebhookSecret: '',
  stripeExpressWebhookSecret: '',
  mandrillApiKey: '',
  isLocal: false,
  nodeEnv: 'develop',
  port: 4000,
  emailService: 'gmail',
  environment: 'local',
  supportScaling: false,
  numberOfActiveServers: 0,
  supportEmail: 'theliveofficesupport@gmail.com',
  adminEmail: 'admin.nongdan.dev@gmail.com',
  adminPassword: 'admin.theliveoffice',
  googleClientId:
    '262625104810-160tsngddev8rlpi729qjnvuukh8vlok.apps.googleusercontent.com',
  googleSecret: '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',
  apiVersion: '0.0.1',
  appVersion: '0.0.1',
  isSyncData: false,
  isSeed: false,
  mediaServicePort: '9091',
  geolocationApiKey: '',
  openaiUrl: '',
  openaiApiKey: '',
  awsAccessKeyId: '',
  awsSecretAccessKey: '',
};
