import XRegExp from 'xregexp';

export const unicodeLettersString = XRegExp('^[\\p{L}\\s-&]*$');
export const hasArrayIndex = /.*\[\d*]/;
