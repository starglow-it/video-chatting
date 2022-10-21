import * as yup from 'yup';

export const companyNameSchema = () => yup.string().trim('noSpaces').max(100, 'maxLength.100');
