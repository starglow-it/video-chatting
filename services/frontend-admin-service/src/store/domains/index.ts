import { createDomain } from 'effector-next';

export const rootDomain = createDomain('rootDomain');
export const authDomain = rootDomain.createDomain('authDomain');
export const statisticsDomain = rootDomain.createDomain('statisticsDomain');
export const roomsDomain = rootDomain.createDomain('roomsDomain');
