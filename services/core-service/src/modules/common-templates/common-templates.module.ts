import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// controllers
import { CommonTemplatesController } from './common-templates.controller';

// services
import { CommonTemplatesService } from './common-templates.service';
import { AwsConnectorModule } from '../../services/aws-connector/aws-connector.module';
import { CountersModule } from '../counters/counters.module';

// schemas
import {
  CommonTemplate,
  CommonTemplateSchema,
} from '../../schemas/common-template.schema';
import {
  PreviewImage,
  PreviewImageSchema,
} from '../../schemas/preview-image.schema';

// modules
import { LanguagesModule } from '../languages/languages.module';
import { UsersModule } from '../users/users.module';
import { BusinessCategoriesModule } from '../business-categories/business-categories.module';
import { UserTemplatesModule } from '../user-templates/user-templates.module';
import { MeetingsModule } from '../meetings/meetings.module';

@Module({
  imports: [
    UsersModule,
    LanguagesModule,
    BusinessCategoriesModule,
    AwsConnectorModule,
    CountersModule,
    forwardRef(() => UserTemplatesModule),
    forwardRef(() => MeetingsModule),
    MongooseModule.forFeature([
      { name: CommonTemplate.name, schema: CommonTemplateSchema },
      { name: PreviewImage.name, schema: PreviewImageSchema },
    ]),
  ],
  controllers: [CommonTemplatesController],
  providers: [CommonTemplatesService],
  exports: [CommonTemplatesService],
})
export class CommonTemplatesModule {}
