import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Language, LanguageDocument } from '../schemas/language.schema';

import { ITransactionSession } from '../helpers/mongo/withTransaction';

import { ILanguage } from '@shared/interfaces/common-language.interface';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectModel(Language.name)
    private language: Model<LanguageDocument>,
  ) {}

  async create(data: ILanguage) {
    return this.language.create(data);
  }

  async find(
    query: FilterQuery<LanguageDocument>,
    session: ITransactionSession,
  ): Promise<LanguageDocument[]> {
    return this.language.find(query, {}, { session: session?.session });
  }

  async exists(query: FilterQuery<LanguageDocument>): Promise<boolean> {
    return this.language.exists(query);
  }
}
