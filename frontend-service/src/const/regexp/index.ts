import XRegExp from 'xregexp';

export const unicodeLettersString = XRegExp('^\\p{L}*$');
export const hasArrayIndex = /.*\[\d*]/;
