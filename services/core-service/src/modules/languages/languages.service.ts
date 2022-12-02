import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Language, LanguageDocument } from '../../schemas/language.schema';

import { ILanguage } from 'shared-types';
import {GetModelQuery} from "../../types/custom";

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
    session,
  }: GetModelQuery<LanguageDocument>) {
    return this.language.find(query, {}, { session: session?.session }).exec();
  }

  async exists(query: FilterQuery<LanguageDocument>) {
    return this.language.exists(query);
  }
}
