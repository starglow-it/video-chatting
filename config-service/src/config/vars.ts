import * as dotenv from 'dotenv';
import {ConfigKeys, DefaultConfigValues } from "@shared/interfaces/keys";
import {ConfigKeysType, IConfig} from "@shared/interfaces/config.interface";
import camelCase from 'camelcase';

dotenv.config();

export const vars = Object.freeze({
    logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
});

export const envConfig = Object.keys(process.env)
    .filter((key) => ConfigKeys.includes(camelCase(key) as ConfigKeysType))
    .reduce((a: IConfig, b) => {
        const resultKey = camelCase(b) as ConfigKeysType;

        const resultValue = process.env[b] || DefaultConfigValues[resultKey];

        return a[resultKey] ? a : { ...a, [resultKey]: resultValue };
    }, {} as IConfig) as IConfig;
