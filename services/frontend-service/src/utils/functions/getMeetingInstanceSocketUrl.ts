import frontendConfig from '../../const/config';

export const getMeetingInstanceSocketUrl = (serverIp: string) => {
    const serverDomain = serverIp.split('.').join('-');

    return `https://${serverDomain}.scaling.${frontendConfig.baseEnvDomain}`;
};
