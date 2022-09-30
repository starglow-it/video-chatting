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
import { ICommonTemplate } from '@shared/interfaces/common-template.interface';
import { IUserTemplate } from '@shared/interfaces/user-template.interface';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { CustomPopulateOptions } from '../../types/custom';
import { getScreenShots } from '../../utils/images/getScreenShots';
import { PreviewImage, PreviewImageDocument } from '../../schemas/preview-image.schema';
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
  }) {
    const options: QueryOptions = {
      session: session?.session,
      populate: populatePaths,
      new: true,
    };

    return this.userTemplate.updateOne(query, data, options);
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
    const files = path.join(__dirname, '../../../images', id);
    await mkdirp(files);

    const outputPath = path.join(files, id);
    const fileType = mimeType.split('/')[0];
    await getScreenShots(url, outputPath, fileType);

    const imagesPaths = await fsPromises.readdir(files);

    await this.previewImage.deleteMany({
      key: new RegExp(`^templates/previews/${id}`),
    });

    await this.awsService.deleteResource(`templates/previews/${id}`);

    const uploadedImagesPromises = imagesPaths.map(async (image) => {
      const resolution = image.match(/_(\d*)p\./);
      const file = await fsPromises.readFile(`${files}/${image}`);
      const uploadKey = `templates/previews/${id}/${image}`;
      const fileStats = await fsPromises.stat(`${files}/${image}`);

      const imageUrl = await this.awsService.uploadFile(file, uploadKey);

      await fsPromises.rm(`${files}/${image}`);

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
