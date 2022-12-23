import { Module } from '@nestjs/common';
import { TemplateSoundController } from './template-sound.controller';
import { TemplateSoundService } from './template-sound.service';
import { MongooseModule } from '@nestjs/mongoose';

import {
  TemplateSoundFile,
  TemplateSoundFileSchema,
} from '../../schemas/template-sound-file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TemplateSoundFile.name, schema: TemplateSoundFileSchema },
    ]),
  ],
  controllers: [TemplateSoundController],
  providers: [TemplateSoundService],
  exports: [TemplateSoundService],
})
export class TemplateSoundModule {}
