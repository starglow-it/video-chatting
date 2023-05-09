import XRegExp from 'xregexp';

export const unicodeLettersString = XRegExp('\\p{L}');
export const hasArrayIndex = /.*\[\d*]/;
export const hasHttps = XRegExp('https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&')
