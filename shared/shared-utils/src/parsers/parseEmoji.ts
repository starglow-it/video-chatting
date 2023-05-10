export const parseEmoji = (arr: string[]) => {
  return String.fromCodePoint.apply(null, arr);
};

export const mapEmoji = (url: string) => {
  return url.split('-').map((item) => '0x'.concat(item));
};
