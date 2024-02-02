import { createDomain } from 'effector-next';

export const rootDomain = createDomain('rootDomain');
export const appDomain = rootDomain.createDomain('appDomain');
export const authDomain = rootDomain.createDomain('authDomain');
export const dialogsDomain = rootDomain.createDomain('dialogsDomain');
export const meetingDomain = rootDomain.createDomain('meetingsDomain');
export const meetingsDomain = rootDomain.createDomain('meetingsDomain');
export const notificationsDomain = rootDomain.createDomain(
    'notificationsDomain',
);
export const otherStoresDomain = rootDomain.createDomain('otherStoresDomain');
export const paymentsDomain = rootDomain.createDomain('paymentsDomain');
export const profileDomain = rootDomain.createDomain('profileDomain');
export const statisticsDomain = rootDomain.createDomain('statisticsDomain');
export const videoChatDomain = rootDomain.createDomain('videoChatDomain');
export const supportDomain = rootDomain.createDomain('support');
