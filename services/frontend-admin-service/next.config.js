/** @type {import('next').NextConfig} */
const { withEffectorReactAliases } = require('effector-next/tools');
const { I18NextHMRPlugin } = require('i18next-hmr/plugin');
const path = require('path');

const withTM = require('next-transpile-modules')([
    'shared',
    'shared-frontend',
    'shared-const',
    'shared-utils',
    'shared-types',
]);

const enhance = withEffectorReactAliases();

module.exports = withTM(
    enhance({
        publicRuntimeConfig: {
            applicationName: 'The LiveOffice Admin',
            frontendUrl: process.env.FRONTEND_URL,
            gatewayUrl: process.env.GATEWAY_URL,
            gatewayPort: process.env.GATEWAY_PORT,
            gatewayHost: process.env.GATEWAY_HOST,
            defaultServerIp: process.env.DEFAULT_SERVER_IP,
            vultrStorageHostname: process.env.VULTR_STORAGE_HOSTNAME,
            baseEnvDomain: process.env.BASE_ENV_DOMAIN,
            supportEmail: process.env.SUPPORT_EMAIL,
        },
        reactStrictMode: true,
        typescript: {
            ignoreBuildErrors: true,
        },
        eslint: {
            ignoreDuringBuilds: true,
        },
        images: {
            domains: [process.env.VULTR_STORAGE_HOSTNAME || ''],
        },
        webpack(config, options) {
          if (!options.isServer) {
            config.plugins.push(
                new I18NextHMRPlugin({
                  localesDir: path.resolve(__dirname, 'public/translations'),
                }),
            );
          }

          return config;
        },
    }),
);
