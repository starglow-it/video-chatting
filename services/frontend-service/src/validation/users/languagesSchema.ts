import { string, array } from 'yup';

const languageSchema = string();

export const languagesSchema = () => array().of(languageSchema);
