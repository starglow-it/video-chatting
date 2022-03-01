import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CONFIG_PROVIDER } from '@shared/providers';
import { ConfigKeysType, IConfig } from '@shared/interfaces/config.interface';

@Injectable()
export class ConfigClientService {
  constructor(
    @Inject(CONFIG_PROVIDER)
    private readonly client: ClientProxy,
  ) {}

  async get(key: keyof IConfig): Promise<string> {
    try {
      const pattern = { cmd: 'get' };

      return await this.client.send<ConfigKeysType>(pattern, key).toPromise();
    } catch (err) {
      console.error(err);

      throw err;
    }
  }

  async getAll(): Promise<IConfig> {
    try {
      const pattern = { cmd: 'getAll' };

      return await this.client.send<IConfig>(pattern, {}).toPromise();
    } catch (err) {
      console.error(err);

      throw err;
    }
  }
}
