import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MediaCategory, MediaCategorySchema } from 'src/schemas/media-category.schema';
import { Media, MediaSchema } from 'src/schemas/media.schema';
import { PreviewImage, PreviewImageSchema } from 'src/schemas/preview-image.schema';
import { AwsConnectorModule } from 'src/services/aws-connector/aws-connector.module';
import { UserTemplatesModule } from '../user-templates/user-templates.module';
import { MediaController } from './medias.controller';
import { MediaService } from './medias.service';

@Module({
  imports: [
    AwsConnectorModule,
    forwardRef(() => UserTemplatesModule),
    MongooseModule.forFeature([
      { name: MediaCategory.name, schema: MediaCategorySchema,},
      { name: Media.name, schema: MediaSchema,},
      { name: Media.name, schema: MediaSchema,},
      { name: PreviewImage.name, schema: PreviewImageSchema },
    ]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediasModule {}
