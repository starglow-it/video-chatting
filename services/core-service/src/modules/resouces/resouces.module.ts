import { Module } from '@nestjs/common';
import { ResoucesController } from './resouces.controller';
import { ResoucesService } from './resouces.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Resouce, ResouceSchema } from '../../schemas/resouce.schema';
import { AwsConnectorModule } from '../../services/aws-connector/aws-connector.module';
import {
  PreviewImage,
  PreviewImageSchema,
} from '../../schemas/preview-image.schema';

@Module({
  imports: [
    AwsConnectorModule,
    MongooseModule.forFeature([
      { name: Resouce.name, schema: ResouceSchema },
      { name: PreviewImage.name, schema: PreviewImageSchema },
    ]),
  ],
  controllers: [ResoucesController],
  providers: [ResoucesService],
  exports: [ResoucesService],
})
export class ResouceModule {}
