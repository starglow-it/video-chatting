export const cappitalize = (str: string) =>
  `${str.charAt(0).toUpperCase()}${str.slice(1, str.length).toLowerCase()}`;
