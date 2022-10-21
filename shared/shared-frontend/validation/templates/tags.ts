import * as yup from 'yup';

export const tagsSchema = () =>
    yup
        .array()
        .of(yup.string().unicodeLettersString('tags.unacceptableSymbols'))
        .max(6, 'tags.max');
