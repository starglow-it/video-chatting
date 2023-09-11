import { useEffect } from 'react';
import { initUserWithoutTokenFx } from 'src/store';

import frontendConfig from '../../const/config';

export const MainContainer = () => {
    console.log('#Duy Phan console', 'tao ne');
    useEffect(() => {
        if (frontendConfig.frontendUrl !== window.location.origin) {
            initUserWithoutTokenFx({ subdomain: window.location.origin });
        }
    }, []);

    return null;
};
