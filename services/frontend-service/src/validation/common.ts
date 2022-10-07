import * as yup from 'yup';

export const simpleStringSchema = () => yup.string().trim('noSpaces').max(300, 'maxLength.base');
export const simpleStringSchemaWithLength = (maxLength: number) =>
    yup.string().trim('noSpaces').max(maxLength, `maxLength.${maxLength}`);

export const simpleNumberSchema = () => yup.number();
export const booleanSchema = () => yup.boolean();
