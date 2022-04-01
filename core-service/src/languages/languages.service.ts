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

  async find({
     query,
     session
  }: {
    query: FilterQuery<LanguageDocument>;
    session: ITransactionSession;
  }) {
    return this.language.find(query, {}, { session: session?.session });
  }

  async exists(query: FilterQuery<LanguageDocument>) {
    return this.language.exists(query);
  }
}
