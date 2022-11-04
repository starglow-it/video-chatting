import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// schemas
import {
  UserTemplate,
  UserTemplateSchema,
} from '../../schemas/user-template.schema';
import { SocialLink, SocialLinkSchema } from '../../schemas/social-link.schema';
import {
  PreviewImage,
  PreviewImageSchema,
} from '../../schemas/preview-image.schema';

// modules
import { LanguagesModule } from '../languages/languages.module';
import { BusinessCategoriesModule } from '../business-categories/business-categories.module';
import { UsersModule } from '../users/users.module';
import { AwsConnectorModule } from '../../services/aws-connector/aws-connector.module';
import { CommonTemplatesModule } from '../common-templates/common-templates.module';
import { RoomsStatisticsModule } from '../rooms-statistics/rooms-statistics.module';

// services
import { UserTemplatesService } from './user-templates.service';

// controllers
import { UserTemplatesController } from './user-templates.controller';

@Module({
  imports: [
    UsersModule,
    BusinessCategoriesModule,
    LanguagesModule,
    CommonTemplatesModule,
    AwsConnectorModule,
    RoomsStatisticsModule,
    MongooseModule.forFeature([
      { name: UserTemplate.name, schema: UserTemplateSchema },
      { name: SocialLink.name, schema: SocialLinkSchema },
      { name: PreviewImage.name, schema: PreviewImageSchema },
    ]),
  ],
  controllers: [UserTemplatesController],
  providers: [UserTemplatesService],
  exports: [UserTemplatesService],
})
export class UserTemplatesModule {}
