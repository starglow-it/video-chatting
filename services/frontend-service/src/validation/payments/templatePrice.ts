import { simpleNumberSchema } from '../common';

export const templatePriceSchema = () =>
    simpleNumberSchema().max(999999, 'templatePrice.max').min(5, 'templatePrice.min');

export const paywallPriceSchema = () =>
    simpleNumberSchema().max(999999, 'paywall.max').min(5, 'paywallPrice.min');
