import * as yup from 'yup';

export const passwordSchema = () =>
    yup
        .string()
        .min(8, 'minLength')
        .matches(/(?=.*[a-zA-Z])(?=.*\d).*/gm, 'characters');

export const passwordLoginSchema = () => yup.string();
