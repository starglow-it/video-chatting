import { Module } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Language, LanguageSchema } from '../schemas/language.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Language.name, schema: LanguageSchema },
    ]),
  ],
  providers: [LanguagesService],
  exports: [LanguagesService],
})
export class LanguagesModule {}
