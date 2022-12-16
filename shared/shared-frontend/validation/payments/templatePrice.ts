import { simpleNumberSchema } from '../common';

export const templatePriceSchema = (min = 0.5, max = 999999) =>
    simpleNumberSchema().max(max, 'templatePrice.max').min(min, 'templatePrice.min');
