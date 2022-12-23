import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';

// schemas
import {
  UserTemplate,
  UserTemplateDocument,
} from '../../schemas/user-template.schema';
import {
  SocialLink,
  SocialLinkDocument,
} from '../../schemas/social-link.schema';
import {
  PreviewImage,
  PreviewImageDocument,
} from '../../schemas/preview-image.schema';

// types
import { IUserTemplate, ICommonTemplate } from 'shared-types';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import {
  CustomPopulateOptions,
  GetModelQuery,
  UpdateModelQuery,
} from '../../types/custom';

// services
import { AwsConnectorService } from '../../services/aws-connector/aws-connector.service';

@Injectable()
export class UserTemplatesService {
  constructor(
    private awsService: AwsConnectorService,
    @InjectModel(UserTemplate.name)
    private userTemplate: Model<UserTemplateDocument>,
    @InjectModel(SocialLink.name)
    private social: Model<SocialLinkDocument>,
    @InjectModel(PreviewImage.name)
    private previewImage: Model<PreviewImageDocument>,
  ) {}

  async countUserTemplates(
    query: FilterQuery<UserTemplateDocument>,
  ): Promise<number> {
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
    populatePaths?: CustomPopulateOptions,
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
  }: GetModelQuery<UserTemplateDocument>): Promise<UserTemplateDocument> {
    return this.userTemplate
      .findOne(query, {}, { session: session.session, populate: populatePaths })
      .exec();
  }

  async deleteUserTemplate(
    query: FilterQuery<UserTemplateDocument>,
    { session }: ITransactionSession,
  ): Promise<void> {
    await this.userTemplate.deleteOne(query, { session });

    return;
  }

  async findUserTemplates({
    query,
    options,
    session,
    populatePaths,
  }: GetModelQuery<UserTemplateDocument>): Promise<UserTemplateDocument[]> {
    return this.userTemplate
      .find(
        query,
        {},
        {
          sort: options?.sort,
          skip: options?.skip,
          limit: options?.limit,
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

  async updateUserTemplate({
    query,
    data,
    session,
    populatePaths,
  }: UpdateModelQuery<
    UserTemplateDocument,
    UserTemplateDocument
  >): Promise<any> {
    const options: QueryOptions = {
      session: session?.session,
      populate: populatePaths,
      new: true,
    };

    return this.userTemplate.findOneAndUpdate(query, data, options);
  }

  async deleteUserTemplates({
    query,
    session,
  }: {
    query: FilterQuery<UserTemplateDocument>;
    session?: ITransactionSession;
  }): Promise<any> {
    const options: QueryOptions = {
      session: session?.session,
    };

    return this.userTemplate.deleteMany(query, options);
  }
}
