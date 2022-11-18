export const escapeRegexString = (str: string) => {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }

  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
};
