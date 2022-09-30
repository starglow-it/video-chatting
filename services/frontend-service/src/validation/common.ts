import * as yup from 'yup';

export const simpleStringSchema = () => yup.string().trim('noSpaces').max(300, 'maxLength.300');
export const simpleStringSchemaWithLength = (maxLength: number) =>
    yup.string().trim().max(maxLength, `maxLength.${maxLength}`);

export const simpleNumberSchema = () => yup.number();
export const booleanSchema = () => yup.boolean();
