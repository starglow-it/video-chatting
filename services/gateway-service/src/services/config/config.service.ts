import { ConfigKeysType, IConfig } from '@shared/interfaces/config.interface';
import { sendHttpRequest } from '../../utils/http/sendHttpRequest';

export class ConfigClientService {
  async get<Type>(key: ConfigKeysType): Promise<Type> {
    try {
      const response = await sendHttpRequest({
        url: `http://config-service:4000/v1/config/${key}`,
        method: 'GET',
      });

      return response.data.success;
    } catch (err) {
      console.error(err);

      throw err;
    }
  }

  async getAll(): Promise<IConfig> {
    try {
      const response = await sendHttpRequest({
        url: 'http://config-service:4000/v1/config',
        method: 'GET',
      });

      return response.data.success;
    } catch (err) {
      console.error(err);

      throw err;
    }
  }
}
