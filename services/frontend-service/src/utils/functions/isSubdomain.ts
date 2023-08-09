import config from '../../const/config';

export const isSubdomain = () => {
    return config.frontendUrl === window.location.origin;
};
