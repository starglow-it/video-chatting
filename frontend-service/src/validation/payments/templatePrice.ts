import { simpleNumberSchema } from '../common';

export const templatePriceSchema = () =>
    simpleNumberSchema().max(999999, 'templatePrice.max').min(0.5, 'templatePrice.min');
