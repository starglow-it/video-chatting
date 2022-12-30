import { cappitalize } from './cappitalize';

export const generateKeyByLabel = (label: string) =>
  label
    .split(/\s/)
    .map((item, index) => (index ? cappitalize(item) : item.toLowerCase()))
    .join('');
