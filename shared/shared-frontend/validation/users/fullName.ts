import * as yup from 'yup';

export const fullNameSchema = () => yup.string().trim('noSpaces').max(100, 'maxLength.100');
