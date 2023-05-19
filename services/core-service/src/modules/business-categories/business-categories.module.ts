import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BusinessCategoriesService } from './business-categories.service';
import {
  BusinessCategory,
  BusinessCategorySchema,
} from '../../schemas/business-category.schema';
import { BusinessCategoriesController } from './business-categories.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusinessCategory.name, schema: BusinessCategorySchema,},
    ]),
  ],
  controllers: [BusinessCategoriesController],
  providers: [BusinessCategoriesService],
  exports: [BusinessCategoriesService],
})
export class BusinessCategoriesModule {}
