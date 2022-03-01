/* eslint-disable no-console */
const express = require('express');
const next = require('next');
const compression = require('compression');

const apiPort = parseInt(process.env.GATEWAY_PORT || '3000', 10);
const apiHost = process.env.GATEWAY_HOST || 'gateway-service';
const apiProtocol = process.env.GATEWAY_PROTOCOL || 'http';
const port = parseInt(process.env.INNER_FRONTEND_PORT || '8000', 10);
const projectPath = process.env.PROJECT_PATH || '.';
const env = process.env.NODE_ENV;

const dev = env !== 'production';

const nextI18next = require('./i18n');
const i18nextMiddleware = require('next-i18next/middleware').default;
const { applyServerHMR } = require('i18next-hmr/server');

const proxy = {
    '/api': {
        target: `${apiProtocol}://${apiHost}:${apiPort}/api`,
        pathRewrite: { '^/api': '/' },
        changeOrigin: true,
    },
    '/socket.io': {
        target: `http://socket-service:8080`,
        changeOrigin: true,
        ws: true,
    },
};

const app = next({
    dev,
    dir: `${projectPath}`,
});

const handle = app.getRequestHandler();

let server;

if (process.env.NODE_ENV !== 'production') {
    applyServerHMR(nextI18next.i18n);
}

app.prepare()
    .then(() => {
        server = express();

        if (!dev) {
            server.use(compression());
        }

        server.use(i18nextMiddleware(nextI18next));

        // Set up the proxy.
        const proxyMiddleware = require('http-proxy-middleware');

        Object.entries(proxy).map(contextEntry => {
            server.use(proxyMiddleware.createProxyMiddleware(contextEntry[0], contextEntry[1]));
        });

        // Default catch-all handler to allow Next.js to handle all other routes
        server.all('*', (req, res) => handle(req, res));

        server.listen(port, () => {
            console.log(`> Ready on port ${port} [${env}]`);
        });
    })
    .catch(err => {
        console.log('An error occurred, unable to start the server');
        console.log('Error; server;', err);
    });
