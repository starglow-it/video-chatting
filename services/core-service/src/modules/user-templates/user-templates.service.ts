import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as fsPromises from 'fs/promises';

// schemas
import {
  UserTemplate,
  UserTemplateDocument,
} from '../../schemas/user-template.schema';
import {
  SocialLink,
  SocialLinkDocument,
} from '../../schemas/social-link.schema';

// types
import { IUserTemplate, ICommonTemplate, QueryParams } from 'shared-types';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { CustomPopulateOptions } from '../../types/custom';
import { getScreenShots } from '../../utils/images/getScreenShots';
import {
  PreviewImage,
  PreviewImageDocument,
} from '../../schemas/preview-image.schema';
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
  ): Promise<void> {
    await this.userTemplate.deleteOne(query, { session });

    return;
  }

  async findUserTemplates({
    query,
    options,
    session,
    populatePaths,
  }: {
    query: FilterQuery<UserTemplateDocument>;
    options?: QueryParams;
    session?: ITransactionSession;
    populatePaths?: CustomPopulateOptions;
  }): Promise<UserTemplateDocument[]> {
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
  }: {
    query: FilterQuery<UserTemplateDocument>;
    data: UpdateQuery<UserTemplateDocument>;
    session?: ITransactionSession;
    populatePaths?: QueryOptions['populate'];
  }): Promise<any> {
    const options: QueryOptions = {
      session: session?.session,
      populate: populatePaths,
      new: true,
    };

    return this.userTemplate.findOneAndUpdate(query, data, options);
  }

  async generatePreviews({
    id,
    mimeType,
    url,
  }: {
    id: string;
    mimeType: string;
    url: string;
  }) {
    const outputPath = path.join(__dirname, '../../../../images', id);
    await mkdirp(outputPath);

    const fileType = mimeType.split('/')[0];
    await getScreenShots(url, outputPath, fileType);

    const imagesPaths = await fsPromises.readdir(outputPath);

    await this.previewImage.deleteMany({
      key: new RegExp(`^templates/images/${id}`),
    });

    await this.awsService.deleteFolder(`templates/images/${id}`);

    const uploadedImagesPromises = imagesPaths.map(async (image) => {
      const resolution = image.match(/(\d*)p\./);

      const file = await fsPromises.readFile(`${outputPath}/${image}`);
      const uploadKey = `templates/images/${id}/${image}`;
      const fileStats = await fsPromises.stat(`${outputPath}/${image}`);

      const imageUrl = await this.awsService.uploadFile(file, uploadKey);

      await fsPromises.rm(`${outputPath}/${image}`);

      return this.previewImage.create({
        url: imageUrl,
        resolution: resolution?.[1],
        size: fileStats.size,
        mimeType: 'image/png',
        key: uploadKey,
      });
    });

    return Promise.all(uploadedImagesPromises);
  }
}
