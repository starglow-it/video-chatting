import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef, Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { User, UserSchema } from '../../schemas/user.schema';
import { UsersController } from './users.controller';
import { UserTokenModule } from '../user-token/user-token.module';
import { Language, LanguageSchema } from '../../schemas/language.schema';
import { SocialLink, SocialLinkSchema } from '../../schemas/social-link.schema';
import { BusinessCategoriesModule } from '../business-categories/business-categories.module';
import {
  ProfileAvatar,
  ProfileAvatarSchema,
} from '../../schemas/profile-avatar.schema';
import { AwsConnectorModule } from '../../services/aws-connector/aws-connector.module';
import { LanguagesModule } from '../languages/languages.module';
import { VerificationCodeModule } from '../verification-code/verification-code.module';
import { TasksModule } from '../tasks/tasks.module';
import { CountryStatisticsModule } from '../country-statistics/country-statistics.module';

@Module({
  imports: [
    LanguagesModule,
    BusinessCategoriesModule,
    AwsConnectorModule,
    VerificationCodeModule,
    TasksModule,
    CountryStatisticsModule,
    MongooseModule.forFeature([
      { name: Language.name, schema: LanguageSchema },
      { name: User.name, schema: UserSchema },
      { name: SocialLink.name, schema: SocialLinkSchema },
      { name: ProfileAvatar.name, schema: ProfileAvatarSchema },
    ]),
    forwardRef(() => UserTokenModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
