import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BusinessCategoriesService } from './business-categories.service';
import {
  BusinessCategory,
  BusinessCategorySchema,
} from '../../schemas/business-category.schema';
import { BusinessCategoriesController } from './business-categories.controller';
import { BusinessMedia, BusinessMediaSchema } from 'src/schemas/business-media.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusinessCategory.name, schema: BusinessCategorySchema,},
      { name: BusinessMedia.name, schema: BusinessMediaSchema,},
    ]),
  ],
  controllers: [BusinessCategoriesController],
  providers: [BusinessCategoriesService],
  exports: [BusinessCategoriesService],
})
export class BusinessCategoriesModule {}
