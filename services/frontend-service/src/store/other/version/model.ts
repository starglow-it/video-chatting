import { otherStoresDomain } from 'src/store/domains';
import { Version } from './types';

export const $appVersionStore = otherStoresDomain.store<Version>({
    apiVersion: '',
    appVersion: '',
});

export const getAppVersionFx = otherStoresDomain.effect<void, Version>(
    'getAppVersionFx',
);
