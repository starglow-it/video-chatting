import { otherStoresDomain } from '../domain/model';

export const $routeToChangeStore = otherStoresDomain.store<string>('');

export const setRouteToChangeEvent = otherStoresDomain.event<string>('setRouteToChangeEvent');
