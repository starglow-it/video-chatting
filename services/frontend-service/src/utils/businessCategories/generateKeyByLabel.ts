import { capitalizeFirstLetter } from '../string/capitalizeFirstLetter';

export const generateKeyByLabel = (label: string) =>
    label
        .split(/\s/)
        .map((item, index) =>
            index ? capitalizeFirstLetter(item) : item.toLowerCase(),
        )
        .join('');
