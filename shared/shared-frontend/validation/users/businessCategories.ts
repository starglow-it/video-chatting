import { string, array } from 'yup';

const businessCategorySchema = string();

export const businessCategoriesSchema = () => array().of(businessCategorySchema);
