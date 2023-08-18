import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  OnModuleInit,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CoreBrokerPatterns } from 'shared-const';
import { ConfigClientService } from './services/config/config.service';
import { CoreService } from './services/core/core.service';
import { Response } from 'express';

enum Collection {
  MediaCategory = 'mediaCategory',
  Media = 'media',
  UserTemplateMedia = 'userTemplateMedia',
}
class TestingStagingRequest {
  @ApiProperty({
    type: String,
    enum: Collection,
  })
  @IsEnum(Collection)
  collection: string;
}

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private readonly configService: ConfigClientService,
    private coreService: CoreService,
  ) {}

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
