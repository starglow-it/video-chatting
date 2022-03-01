import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { UserTemplatesModule } from '../user-templates/user-templates.module';
import { UsersModule } from '../users/users.module';
import { LanguagesModule } from '../languages/languages.module';
import { BusinessCategoriesModule } from '../business-categories/business-categories.module';
import { CommonTemplatesModule } from '../common-templates/common-templates.module';

@Module({
  imports: [
    CommonTemplatesModule,
    UsersModule,
    UserTemplatesModule,
    BusinessCategoriesModule,
    LanguagesModule,
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
