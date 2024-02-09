const { withEffectorReactAliases } = require('effector-next/tools');
const { I18NextHMRPlugin } = require('i18next-hmr/plugin');
const path = require('path');

const withTM = require('next-transpile-modules')([
    'shared-frontend',
    'shared-const',
    'shared-utils',
    'shared-types',
    '@mui/x-charts',
    'gsap',
]);

const enhance = withEffectorReactAliases();

/**
 * @type {import('next').NextConfig}
 */
module.exports = withTM(
    enhance({
        publicRuntimeConfig: {
            applicationName: 'Ruume',
            frontendUrl: process.env.FRONTEND_URL,
            gatewayUrl: process.env.GATEWAY_URL,
            gatewayPort: process.env.GATEWAY_PORT,
            gatewayHost: process.env.GATEWAY_HOST,
            turnUrl: process.env.TURN_URL,
            turnPassword: process.env.TURN_PASSWORD,
            turnUserName: process.env.TURN_USERNAME,
            livekitWss: process.env.LIVEKIT_WSS,
            meetingSocketUrl: process.env.MEETING_SOCKET_URL,
            defaultServerIp: process.env.DEFAULT_SERVER_IP,
            turnPort: parseInt(process.env.TURN_PORT, 10),
            vultrStorageHostname: process.env.VULTR_STORAGE_HOSTNAME,
            stripePublicKey: process.env.STRIPE_PUBLIC_API_KEY,
            baseEnvDomain: process.env.BASE_ENV_DOMAIN,
            supportEmail: process.env.SUPPORT_EMAIL,
            geolocationApiKey: process.env.GEOLOCATION_API_KEY,
            googleClientId: process.env.GOOGLE_CLIENT_ID,
        },
        reactStrictMode: false,
        typescript: {
            ignoreBuildErrors: true,
        },
        eslint: {
            ignoreDuringBuilds: true,
        },
        images: {
            unoptimized: true,
            domains: [process.env.VULTR_STORAGE_HOSTNAME || ''],
        },
        webpack(config, options) {
            if (process.env.NEXT_WEBPACK_USEPOLLING) {
                config.watchOptions = {
                    poll: 5000,
                    aggregateTimeout: 600,
                };
            }
            if (!options.isServer) {
                config.plugins.push(
                    new I18NextHMRPlugin({
                        localesDir: path.resolve(
                            __dirname,
                            'public/translations',
                        ),
                    }),
                );
            }

            return config;
        },
        devIndicators: {
            buildActivity: false,
        },
    }),
);
