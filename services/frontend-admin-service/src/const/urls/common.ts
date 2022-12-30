import getConfig from 'next/config';
import { isServer } from 'shared-utils';

const {
	publicRuntimeConfig 
} = getConfig();

export const serverUrl = isServer()
	? `http://${publicRuntimeConfig.gatewayHost}:${publicRuntimeConfig.gatewayPort}/api`
	: '/api';
