import getConfig from 'next/config';
import isServer from '../../helpers/isServer';

const { publicRuntimeConfig } = getConfig();

export const serverUrl = isServer()
    ? `http://${publicRuntimeConfig.gatewayHost}:${publicRuntimeConfig.gatewayPort}/api`
    : '/api';

export const authScope = 'auth';
export const meetingScope = 'meetings';
export const usersScope = 'users';
export const templatesScope = 'templates';
export const uploadScope = 'upload';
export const profileScope = 'profile';
export const paymentsScope = 'payments';
export const medias = 'medias';
