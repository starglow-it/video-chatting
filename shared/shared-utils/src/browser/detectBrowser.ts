import { parse, Parser } from 'bowser';

export const getBrowserData = (): Parser.ParsedResult =>
  parse(window.navigator.userAgent);

export const isSafari = () =>
  parse(window.navigator.userAgent).browser.name === 'Safari';

export const isMobile = () =>
  // parse(window.navigator.userAgent).platform.type === 'mobile';
  /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
