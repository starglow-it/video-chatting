import { otherStoresDomain } from '../../domains';

export const $routeToChangeStore = otherStoresDomain.store<string>('');

export const setRouteToChangeEvent = otherStoresDomain.event<string>('setRouteToChangeEvent');
