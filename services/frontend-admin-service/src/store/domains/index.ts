import { createDomain } from 'effector-next';

export const rootDomain = createDomain('rootDomain');
export const authDomain = rootDomain.createDomain('authDomain');
