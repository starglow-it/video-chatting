import { Controller } from '@nestjs/common';
import { Connection, PipelineStage, UpdateQuery } from 'mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { InjectConnection } from '@nestjs/mongoose';
import { Types } from 'mongoose';

const ObjectId = Types.ObjectId;

//  const
import { TEMPLATES_SERVICE, TemplateBrokerPatterns } from 'shared-const';

// types
import {
  ICommonTemplate,
  EntityList,
  AddTemplateToUserPayload,
  GetCommonTemplatePayload,
  GetCommonTemplatesPayload,
  CreateTemplatePayload,
  EditTemplatePayload,
  UploadTemplateFilePayload,
  DeleteCommonTemplatePayload,
} from 'shared-types';

// dtos
import { CommonTemplateDTO } from '../../dtos/common-template.dto';
import { UserTemplateDTO } from '../../dtos/user-template.dto';

// services
import { CommonTemplatesService } from './common-templates.service';
import { UsersService } from '../users/users.service';
import { MeetingsService } from '../meetings/meetings.service';
import { UserTemplatesService } from '../user-templates/user-templates.service';
import { BusinessCategoriesService } from '../business-categories/business-categories.service';
import { UserProfileStatisticService } from '../user-profile-statistic/user-profile-statistic.service';
import { RoomsStatisticsService } from '../rooms-statistics/rooms-statistics.service';

// helpers
import { withTransaction } from '../../helpers/mongo/withTransaction';

import { CommonTemplateDocument } from '../../schemas/common-template.schema';

@Controller('common-templates')
export class CommonTemplatesController {
  constructor(
    @InjectConnection() private connection: Connection,
    private commonTemplatesService: CommonTemplatesService,
    private userTemplatesService: UserTemplatesService,
    private meetingsService: MeetingsService,
    private usersService: UsersService,
    private businessCategoriesService: BusinessCategoriesService,
    private roomStatisticService: RoomsStatisticsService,
    private userProfileStatisticService: UserProfileStatisticService,
  ) {}

  @MessagePattern({ cmd: TemplateBrokerPatterns.GetCommonTemplates })
  async getCommonTemplates(
    @Payload()
    { query, options = { skip: 6, limit: 0 } }: GetCommonTemplatesPayload,
  ): Promise<EntityList<ICommonTemplate>> {
    try {
      return withTransaction(this.connection, async () => {
        const aggregationPipeline: PipelineStage[] = [
          { $match: query },
          {
            $lookup: {
              from: 'businesscategories',
              localField: 'businessCategories',
              foreignField: '_id',
              as: 'businessCategories',
            },
          },
          {
            $lookup: {
              from: 'previewimages',
              localField: 'previewUrls',
              foreignField: '_id',
              as: 'previewUrls',
            },
          },
          {
            $lookup: {
              from: 'usertemplates',
              localField: 'templateId',
              foreignField: 'templateId',
              pipeline: [{ $match: { user: new ObjectId(options.userId) } }],
              as: 'userTemplate',
            },
          },
          { $sort: { maxParticipants: 1 } },
        ];

        if (options.limit) {
          aggregationPipeline.push({ $limit: options.limit });
        }

        if (options.skip) {
          aggregationPipeline.push({ $skip: options.skip });
        }

        const commonTemplates = await this.commonTemplatesService.aggregate(
          aggregationPipeline,
        );

        const commonTemplatesCount =
          await this.commonTemplatesService.countCommonTemplates({
            query: query,
          });

        const parsedTemplates = plainToInstance(
          CommonTemplateDTO,
          commonTemplates,
          {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          },
        );

        return {
          list: parsedTemplates,
          count: commonTemplatesCount,
        };
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.GetCommonTemplateById })
  async getCommonTemplateById(
    @Payload() { id }: GetCommonTemplatePayload,
  ): Promise<ICommonTemplate> {
    try {
      return withTransaction(this.connection, async (session) => {
        const commonTemplate =
          await this.commonTemplatesService.findCommonTemplateById({
            templateId: id,
            session,
            populatePaths: [
              { path: 'businessCategories' },
              { path: 'previewUrls' },
            ],
          });

        return plainToInstance(CommonTemplateDTO, commonTemplate, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.GetCommonTemplate })
  async getCommonTemplate(
    @Payload() payload: GetCommonTemplatePayload,
  ): Promise<ICommonTemplate> {
    try {
      return withTransaction(this.connection, async (session) => {
        const commonTemplate =
          await this.commonTemplatesService.findCommonTemplate({
            query: payload,
            session,
            populatePaths: [
              { path: 'businessCategories' },
              { path: 'previewUrls' },
              { path: 'author' },
            ],
          });

        return plainToInstance(CommonTemplateDTO, commonTemplate, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.AddTemplateToUser })
  async addTemplateToUser(@Payload() data: AddTemplateToUserPayload) {
    return withTransaction(this.connection, async (session) => {
      const targetTemplate =
        await this.commonTemplatesService.findCommonTemplate({
          query: { _id: data.templateId },
          session,
          populatePaths: ['businessCategories'],
        });

      const targetUser = await this.usersService.findUser({
        query: {
          _id: data.userId,
        },
        session,
        populatePaths: ['socials', 'languages', 'templates'],
      });

      const templateData = {
        user: targetUser._id,
        templateId: targetTemplate.templateId,
        url: targetTemplate.url,
        name: targetTemplate.name,
        maxParticipants: targetTemplate.maxParticipants,
        previewUrls: targetTemplate.previewUrls,
        type: targetTemplate.type,
        templateType: targetTemplate.templateType,
        priceInCents: targetTemplate.priceInCents,
        businessCategories: targetTemplate?.businessCategories?.map(
          (category) => category._id,
        ),
        fullName: targetUser.fullName,
        position: targetUser.position,
        description: targetTemplate.description,
        shortDescription: targetTemplate.shortDescription,
        companyName: targetUser.companyName,
        contactEmail: targetUser.contactEmail,
        languages: targetUser.languages.map((language) => language._id),
        socials: targetUser.socials.map((social) => social._id),
        usersPosition: targetTemplate.usersPosition,
        isAudioAvailable: targetTemplate.isAudioAvailable,
        links: targetTemplate.links,
        signBoard: targetUser.signBoard,
        author: targetTemplate.author,
      };

      const [userTemplate] = await this.userTemplatesService.createUserTemplate(
        templateData,
        session,
      );

      targetUser.templates.push(userTemplate);

      await targetUser.save();

      const isRoomStatisticsExists = await this.roomStatisticService.exists({
        query: {
          template: targetTemplate._id,
        },
      });

      if (!isRoomStatisticsExists) {
        await this.roomStatisticService.create({
          data: {
            template: targetTemplate._id,
            author: targetTemplate.author,
            transactions: 0,
            minutes: 0,
            calls: 0,
            money: 0,
            uniqueUsers: 1,
          },
          session,
        });
      } else {
        await this.roomStatisticService.updateOne({
          query: {
            template: targetTemplate._id,
          },
          data: {
            $inc: { uniqueUsers: 1 },
          },
          session,
        });
      }

      await this.userProfileStatisticService.updateOne({
        query: { user: targetUser._id },
        data: {
          $inc: { roomsUsed: 1 },
        },
      });

      return plainToInstance(UserTemplateDTO, userTemplate, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.UploadTemplateFile })
  async uploadTemplateFile(
    @Payload() data: UploadTemplateFilePayload,
  ): Promise<void> {
    const { url, id, mimeType } = data;

    const previewImages = await this.commonTemplatesService.generatePreviews({
      url,
      id,
      mimeType,
    });

    const imageIds = previewImages.map((image) => image._id);

    await this.commonTemplatesService.updateCommonTemplate({
      query: {
        _id: id,
      },
      data: {
        templateType: mimeType.includes('image') ? 'image' : 'video',
        draftPreviewUrls: imageIds,
        draftUrl: url,
      },
    });

    return;
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.CreateTemplate })
  async createTemplate(@Payload() data: CreateTemplatePayload) {
    return withTransaction(this.connection, async (session) => {
      const template = await this.commonTemplatesService.createCommonTemplate({
        data: {
          author: data.userId,
        },
        session,
      });

      return plainToInstance(CommonTemplateDTO, template, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.UpdateTemplate })
  async editTemplate(@Payload() { templateId, data }: EditTemplatePayload) {
    return withTransaction(this.connection, async (session) => {
      const { businessCategories, ...restData } = data;

      const updateData: UpdateQuery<CommonTemplateDocument> = {
        ...restData,
        draftUrl: '',
        draftPreviewUrls: [],
      };

      if ('businessCategories' in data) {
        const businessCategoriesPromises = await Promise.all(
          businessCategories?.map(async (category) => {
            const [existingCategory] =
              await this.businessCategoriesService.find({
                query: { key: category.key },
                session,
              });

            if (existingCategory) {
              return existingCategory;
            }

            return this.businessCategoriesService.create({
              key: category.key,
              value: category.value,
              color: category.color,
            });
          }) ?? [],
        );

        updateData.businessCategories = businessCategoriesPromises.map(
          ({ _id }) => _id,
        );
      }

      const template = await this.commonTemplatesService.updateCommonTemplate({
        query: {
          _id: templateId,
        },
        data: updateData,
        session,
      });

      return plainToInstance(CommonTemplateDTO, template, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.DeleteCommonTemplate })
  async deleteCommonTemplate(
    @Payload() { templateId }: DeleteCommonTemplatePayload,
  ): Promise<undefined> {
    try {
      return withTransaction(this.connection, async (session) => {
        const template =
          await this.commonTemplatesService.findCommonTemplateById({
            templateId,
            session,
            populatePaths: 'author',
          });

        if (!template) {
          return;
        }

        await this.commonTemplatesService.deleteCommonTemplate({
          query: {
            _id: template._id,
          },
          session,
        });

        await this.roomStatisticService.delete({
          query: {
            template: template._id,
          },
          session,
        });
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }
}
