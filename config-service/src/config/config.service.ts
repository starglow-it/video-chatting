import { Injectable } from '@nestjs/common';
import * as camelCase from 'camelcase';

import { ConfigKeysType, IConfig } from '@shared/interfaces/config.interface';
import { ConfigKeys } from '@shared/interfaces/keys';

@Injectable()
export class ConfigService {
  private readonly envConfig: Partial<IConfig> = {};

  constructor() {
    this.envConfig = this.readConfig();
  }

  getAll(): IConfig {
    return this.envConfig as IConfig;
  }

  get(key: ConfigKeysType): string | number {
    return this.envConfig[key];
  }

  private readConfig(): IConfig {
    return Object.keys(process.env)
      .filter((key) => ConfigKeys.includes(camelCase(key) as ConfigKeysType))
      .reduce((a, b) => {
        const resultKey = camelCase(b);

        const resultValue = process.env[b];

        return a[resultKey] ? a : { ...a, [resultKey]: resultValue };
      }, {}) as IConfig;
  }
}
