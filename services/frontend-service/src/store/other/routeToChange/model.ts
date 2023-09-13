import { otherStoresDomain } from '../../domains';

export const $routeToChangeStore = otherStoresDomain.createStore<string>('');

export const setRouteToChangeEvent = otherStoresDomain.event<string>(
    'setRouteToChangeEvent',
);
