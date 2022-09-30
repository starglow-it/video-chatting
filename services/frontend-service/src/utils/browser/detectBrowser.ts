import { parse } from 'bowser';

export const getBrowserData = () => parse(window.navigator.userAgent);

export const isSafari = () => parse(window.navigator.userAgent).browser.name === 'Safari';

export const isMobile = () => parse(window.navigator.userAgent).platform.type === 'mobile';
