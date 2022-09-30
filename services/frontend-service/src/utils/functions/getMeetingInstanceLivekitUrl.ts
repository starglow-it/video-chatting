import frontendConfig from '../../const/config';

export const getMeetingInstanceLivekitUrl = (serverIp: string) => {
    const serverDomain = serverIp.split('.').join('-');

    return `https://${serverDomain}.scaling.${frontendConfig.baseEnvDomain}`;
};
