import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { UserTemplatesModule } from '../user-templates/user-templates.module';
import { UsersModule } from '../users/users.module';
import { LanguagesModule } from '../languages/languages.module';
import { BusinessCategoriesModule } from '../business-categories/business-categories.module';
import { CommonTemplatesModule } from '../common-templates/common-templates.module';
import { AwsConnectorModule } from '../aws-connector/aws-connector.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PreviewImage,
  PreviewImageSchema,
} from '../schemas/preview-image.schema';

@Module({
  imports: [
    CommonTemplatesModule,
    UsersModule,
    UserTemplatesModule,
    BusinessCategoriesModule,
    LanguagesModule,
    AwsConnectorModule,
    MongooseModule.forFeature([
      { name: PreviewImage.name, schema: PreviewImageSchema },
    ]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
