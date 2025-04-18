import getConfig from 'next/config';
import { isServer } from 'shared-utils';

const { publicRuntimeConfig } = getConfig();

export const serverUrl = isServer()
    ? `http://${publicRuntimeConfig.gatewayHost}:${publicRuntimeConfig.gatewayPort}/api`
    : '/api';

export const mediaServerUrl = isServer() ? `http://${publicRuntimeConfig.defaultServerIp}:${publicRuntimeConfig.mediaServicePort}` : '/media-server';
export const awsTranscribeServiceUrl = isServer() ? `http://${publicRuntimeConfig.defaultServerIp}:3010` : 'aws-transcribe';