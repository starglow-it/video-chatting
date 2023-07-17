import * as yup from 'yup';

export const tagsSchema = () =>
    yup
        .array()
        .of(
            yup.object({
                id: yup.string().optional(),
                key: yup.string().required(),
                value: yup
                    .string()
                    .unicodeLettersString('tags.unacceptableSymbols')
                    .required(),
                color: yup.string().required(),
            }),
        )
        .max(6, 'tags.max');
