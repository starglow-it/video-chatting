import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

// schemas
import {
  UserTemplate,
  UserTemplateDocument,
} from '../schemas/user-template.schema';
import { SocialLink, SocialLinkDocument } from '../schemas/social-link.schema';

// types
import { ICommonTemplate } from '@shared/interfaces/common-template.interface';
import { IUserTemplate } from '@shared/interfaces/user-template.interface';
import { ITransactionSession } from '../helpers/mongo/withTransaction';
import { CustomPopulateOptions } from '../types/custom';

@Injectable()
export class UserTemplatesService {
  constructor(
    @InjectModel(UserTemplate.name)
    private userTemplate: Model<UserTemplateDocument>,
    @InjectModel(SocialLink.name)
    private social: Model<SocialLinkDocument>,
  ) {}

  async countUserTemplates(query): Promise<number> {
    return this.userTemplate.count(query).exec();
  }

  async createUserTemplates({
    userId,
    templates,
  }: {
    userId: string;
    templates: ICommonTemplate[];
  }): Promise<UserTemplateDocument[]> {
    const createPromises = templates.map(async (data) => {
      return this.userTemplate.create({ user: userId, ...data });
    });

    return Promise.all(createPromises);
  }

  async createUserTemplate(
    data,
    { session }: ITransactionSession,
  ): Promise<UserTemplateDocument[]> {
    return this.userTemplate.create([data], { session });
  }

  async findUserTemplateById({
    id,
    session,
    populatePaths,
  }: {
    id: string;
    session: ITransactionSession;
    populatePaths?: CustomPopulateOptions;
  }): Promise<UserTemplateDocument> {
    return this.userTemplate
      .findById(id, {}, { session: session.session, populate: populatePaths })
      .exec();
  }

  async findUserTemplateByIdAndUpdate(
    id: IUserTemplate['id'],
    data: UpdateQuery<UserTemplateDocument>,
    { session }: ITransactionSession,
    populatePaths: CustomPopulateOptions,
  ): Promise<UserTemplateDocument> {
    return this.userTemplate
      .findByIdAndUpdate(id, data, {
        new: true,
        session,
        populate: populatePaths,
      })
      .exec();
  }

  async findUserTemplate({
    query,
    session,
    populatePaths,
  }: {
    query: FilterQuery<UserTemplateDocument>;
    session: ITransactionSession;
    populatePaths?: CustomPopulateOptions;
  }): Promise<UserTemplateDocument> {
    return this.userTemplate
      .findOne(query, {}, { session: session.session, populate: populatePaths })
      .exec();
  }

  async deleteUserTemplate(
    query: FilterQuery<UserTemplateDocument>,
    { session }: ITransactionSession,
  ) {
    return this.userTemplate.deleteOne(query, { session });
  }

  async findUserTemplates({
    query,
    options: { sort, limit, skip },
    session,
    populatePaths,
  }: {
    query: FilterQuery<UserTemplateDocument>;
    options?: { sort?: string; skip?: number; limit?: number };
    session?: ITransactionSession;
    populatePaths?: CustomPopulateOptions;
  }): Promise<UserTemplateDocument[]> {
    return this.userTemplate
      .find(
        query,
        {},
        {
          sort,
          skip,
          limit,
          session: session?.session,
          populate: populatePaths,
        },
      )
      .exec();
  }

  async createUserTemplateSocialsLinks(
    { userId, socials },
    { session }: ITransactionSession,
  ) {
    const newSocials = Object.entries(socials).map((socialEntry) => {
      return {
        user: userId,
        key: socialEntry[0],
        value: socialEntry[1],
      };
    });

    return this.social.create(newSocials, { session });
  }
}
