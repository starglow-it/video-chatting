import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ConfigService } from './config.service';
import { IConfig } from '@shared/interfaces/config.interface';

@Controller()
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @MessagePattern({ cmd: 'get' })
  getKey(key: keyof IConfig): string | number {
    return this.configService.get(key);
  }

  @MessagePattern({ cmd: 'getAll' })
  getAll(): IConfig {
    return this.configService.getAll();
  }
}
