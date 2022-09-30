import { uiDomain } from './domain/model';

export const $isSideUsersOpenStore = uiDomain.createStore<boolean>(false);
export const setIsSideUsersOpenEvent = uiDomain.createEvent<boolean>();
