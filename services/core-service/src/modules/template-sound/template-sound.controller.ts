import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { TEMPLATES_SERVICE, TemplateSoundBrokerPatterns } from 'shared-const';
import { CreateTemplateSoundPayload } from 'shared-types';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { TemplateSoundService } from './template-sound.service';
import { withTransaction } from '../../helpers/mongo/withTransaction';
import { plainToInstance } from 'class-transformer';
import { TemplateSoundFileDTO } from '../../dtos/template-sound.dto';

@Controller('template-sound')
export class TemplateSoundController {
  constructor(
    @InjectConnection() private connection: Connection,
    private templateSoundService: TemplateSoundService,
  ) {}
  @MessagePattern({ cmd: TemplateSoundBrokerPatterns.CreateTemplateSoundFile })
  async createSound(@Payload() payload: CreateTemplateSoundPayload) {
    try {
      return withTransaction(this.connection, async (session) => {
        const [soundData] = await this.templateSoundService.create({
          data: {
            fileName: payload.fileName,
            url: payload.url,
            mimeType: payload.mimeType,
            size: payload.size,
            uploadKey: payload.uploadKey,
          },
          session,
        });

        return plainToInstance(TemplateSoundFileDTO, soundData, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }
}
