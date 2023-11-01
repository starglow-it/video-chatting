import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigClientService } from './services/config/config.service';

@Controller()
export class AppController implements OnModuleInit {
  constructor(private readonly configService: ConfigClientService) {}

  private readonly logger = new Logger();
  private apiVersion: string;
  private appVersion: string;

  async onModuleInit() {
    this.apiVersion = await this.configService.get('apiVersion');
    this.appVersion = await this.configService.get('appVersion');
  }

  @Get('versions')
  async getVersions() {
    try {
      return {
        success: true,
        result: {
          apiVersion: this.apiVersion,
          appVersion: this.appVersion,
        },
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get api version`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }
}
