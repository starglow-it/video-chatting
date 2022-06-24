/** @type {import('next').NextConfig} */
const { withEffectorReactAliases } = require('effector-next/tools');
const { I18NextHMRPlugin } = require('i18next-hmr/plugin');
const path = require('path');

const enhance = withEffectorReactAliases();

module.exports = enhance({
    publicRuntimeConfig: {
        applicationName: 'The LiveOffice',
        frontendUrl: process.env.FRONTEND_URL,
        gatewayUrl: process.env.GATEWAY_URL,
        gatewayPort: process.env.GATEWAY_PORT,
        gatewayHost: process.env.GATEWAY_HOST,
        turnUrl: process.env.TURN_URL,
        turnPassword: process.env.TURN_PASSWORD,
        turnUserName: process.env.TURN_USERNAME,
        turnPort: parseInt(process.env.TURN_PORT, 10),
        storageHostName: process.env.STORAGE_HOSTNAME,
        stripePublicKey: process.env.STRIPE_PUBLIC_API_KEY
    },
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: [process.env.STORAGE_HOSTNAME || ''],
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
});
