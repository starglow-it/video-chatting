import * as dotenv from 'dotenv';
import camelCase from 'camelcase';

import {
    IConfig,
    ConfigKeysType,
    ConfigKeys,
    DefaultConfigValues,
} from 'shared-types';
import { isBoolean, parseBoolean } from '../utils/parsers/parseBoolean';
import { isNumber, parseNumber } from '../utils/parsers/parseNumber';

dotenv.config();

export const vars = Object.freeze({
    logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
});

export const envConfig = Object.keys(process.env)
    .filter((key) => ConfigKeys.includes(camelCase(key) as ConfigKeysType))
    .reduce((a: IConfig, b) => {
        const resultKey = camelCase(b) as ConfigKeysType;

        const resultValue = process.env[b] || DefaultConfigValues[resultKey];

        if (isBoolean(resultValue as string)) {
            return a[resultKey]
                ? a
                : {
                      ...a,
                      [resultKey]: parseBoolean(resultValue as string, false),
                  };
        }

        if (isNumber(resultValue as string)) {
            return a[resultKey]
                ? a
                : { ...a, [resultKey]: parseNumber(resultValue as string, 0) };
        }

        return a[resultKey] ? a : { ...a, [resultKey]: resultValue };
    }, {} as IConfig) as IConfig;
