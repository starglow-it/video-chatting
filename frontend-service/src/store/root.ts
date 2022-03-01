import { createDomain, createEvent } from 'effector-next';

export const root = createDomain('main-app');

export const pageLoaded = createEvent();
