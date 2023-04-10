import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MediaCategory, MediaCategorySchema } from 'src/schemas/media-category.schema';
import { Media, MediaSchema } from 'src/schemas/media.schema';
import { MediaController } from './medias.controller';
import { MediaService } from './medias.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MediaCategory.name, schema: MediaCategorySchema,},
      { name: Media.name, schema: MediaSchema,},
    ]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediasModule {}
