import * as yup from 'yup';

export const emailSchema = () =>
    yup.string().trim('noSpaces').max(300, 'maxLength.300').email('user.invalid');
