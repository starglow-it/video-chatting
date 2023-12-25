import { Controller } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Connection, UpdateQuery } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import * as mongoose from 'mongoose';

// shared
import {
  TEMPLATES_SERVICE,
  TemplateNativeErrorEnum,
  UserTemplatesBrokerPatterns,
} from 'shared-const';

import {
  CreateUserTemplateByIdPayload,
  DeleteUsersTemplatesPayload,
  GetUsersTemplatesPayload,
  GetUserTemplateByIdPayload,
  GetUserTemplateByTemplateIdPayload,
  GetUserTemplatePayload,
  GetUserTemplatesPayload,
  UpdateUserTemplatePayload,
  IUserTemplate,
  EntityList,
  CountUserTemplatesPayload,
  UpdateUserTemplateUsageNumberPayload,
  DeleteLeastUsedTemplatesPayload,
  DeleteGlobalUserTemplatesPayload,
  UpdateTemplatePaymentPayload,
  ITemplatePayment,
  GetTemplatePaymentsPayload,
  GetTemplatePaymentPayload,
  TemplateCategoryType,
} from 'shared-types';

// helpers
import {
  ITransactionSession,
  withTransaction,
} from '../../helpers/mongo/withTransaction';

// services
import { UserTemplatesService } from './user-templates.service';
import { BusinessCategoriesService } from '../business-categories/business-categories.service';
import { UsersService } from '../users/users.service';
import { CommonTemplatesService } from '../common-templates/common-templates.service';
import { LanguagesService } from '../languages/languages.service';
import { RoomsStatisticsService } from '../rooms-statistics/rooms-statistics.service';
import { UserProfileStatisticService } from '../user-profile-statistic/user-profile-statistic.service';

// dtos
import { UserTemplateDTO } from '../../dtos/user-template.dto';

// schemas
import { UserTemplateDocument } from '../../schemas/user-template.schema';
import { ObjectId, isValidObjectId } from '../../helpers/mongo/isValidObjectId';
import { MediaService } from '../medias/medias.service';
import { MediaCategoryDocument } from '../../schemas/media-category.schema';
import { PreviewImageDocument } from '../../schemas/preview-image.schema';
import { AwsConnectorService } from '../../services/aws-connector/aws-connector.service';
import { FilterQuery } from 'mongoose';
import { MediaDocument } from '../../schemas/media.schema';
import { UserTemplatesComponent } from './user-templates.component';
import { TemplatePaymentsComponent } from '../template-payments/template-payments.component';
import { TemplatePaymentsService } from '../template-payments/template-payments.service';
import { throwRpcError } from '../../utils/common/throwRpcError';
import { TemplatePaymentDocument } from '../../schemas/template-payment.schema';
import {
  TemplatePaymentDto,
  templatePaymentSerialization,
} from '../../dtos/template-payment.dto';

@Controller('templates')
export class UserTemplatesController {
  constructor(
    @InjectConnection() private connection: Connection,
    private userTemplatesService: UserTemplatesService,
    private commonTemplatesService: CommonTemplatesService,
    private awsService: AwsConnectorService,
    private usersService: UsersService,
    private businessCategoriesService: BusinessCategoriesService,
    private languageService: LanguagesService,
    private roomStatisticService: RoomsStatisticsService,
    private userProfileStatisticService: UserProfileStatisticService,
    private mediaService: MediaService,
    private readonly templatePaymentsComponent: TemplatePaymentsComponent,
    private readonly userTemplatesComponent: UserTemplatesComponent,
    private readonly templatePaymentsService: TemplatePaymentsService,
  ) {}

  private async getMyRoomMediaCategory(
    session: ITransactionSession,
  ): Promise<MediaCategoryDocument> {
    try {
      const mediaCategory = await this.mediaService.findMediaCategory({
        query: {
          key: 'myrooms',
        },
        session,
      });

      if (!mediaCategory) {
        throw new RpcException({
          message: 'Media category not found',
          ctx: TEMPLATES_SERVICE,
        });
      }

      return mediaCategory;
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }

  private async deletePreviewUrls<
    T extends { previewUrls: PreviewImageDocument[] },
  >(list: Array<T>, session: ITransactionSession) {
    try {
      const previewImages = list
        .map((item) => item.previewUrls)
        .reduce((prev, cur) => [...prev, ...cur], []);

      await this.mediaService.deletePreviewImages({
        query: {
          _id: {
            $in: previewImages,
          },
        },
        session,
      });

      await Promise.all(
        previewImages.map(
          async (previewImage) =>
            await this.awsService.deleteResource(previewImage.key),
        ),
      );
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }

  private async deleteMedias(
    query: FilterQuery<MediaDocument>,
    session: ITransactionSession,
  ): Promise<void> {
    try {
      const medias = await this.mediaService.findMedias({
        query,
        populatePaths: ['previewUrls'],
        session,
      });

      const mediaCategory = await this.mediaService.findMediaCategory({
        query: {
          key: 'myrooms',
        },
        session,
      });

      await this.mediaService.deleteMedias({
        query,
        session,
      });

      await Promise.all(
        medias.map(
          async (media) =>
            await this.mediaService.deleteMediaFolders(
              `${media._id.toString()}/videos`,
            ),
        ),
      );

      await this.deletePreviewUrls(
        medias.filter(
          (media) =>
            media.mediaCategory._id.toString() !== mediaCategory._id.toString(),
        ),
        session,
      );
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: UserTemplatesBrokerPatterns.GetUserTemplate })
  async getUserTemplate(
    @Payload()
    { id, subdomain = '' }: GetUserTemplatePayload,
  ): Promise<IUserTemplate> {
    return withTransaction(this.connection, async (session) => {
      try {
        const query = {
          subdomain: {
            $regex: new RegExp(`^${subdomain}$`),
            $options: 'i',
          },
        } as FilterQuery<UserTemplateDocument>;
        const userTemplate = await this.userTemplatesService.findUserTemplate({
          query: Object.assign(
            query,
            isValidObjectId(id) ? { _id: id } : { customLink: id },
          ),
          session,
          populatePaths: [
            { path: 'socials' },
            { path: 'businessCategories' },
            { path: 'languages' },
            { path: 'meetingInstance' },
            { path: 'previewUrls' },
            { path: 'user', populate: { path: 'profileAvatar' } },
            { path: 'author' },
          ],
        });

        if (userTemplate?.customLink && isValidObjectId(id)) {
          return null;
        }

        return plainToInstance(UserTemplateDTO, userTemplate, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      } catch (err) {
        throw new RpcException({
          message: err.message,
          ctx: TEMPLATES_SERVICE,
        });
      }
    });
  }

  @MessagePattern({
    cmd: UserTemplatesBrokerPatterns.GetUserTemplateByTemplateId,
  })
  async getUserTemplateByTemplateId(
    @Payload()
    { id, userId }: GetUserTemplateByTemplateIdPayload,
  ): Promise<IUserTemplate> {
    return withTransaction(this.connection, async (session) => {
      try {
        const userTemplate = await this.userTemplatesService.findUserTemplate({
          query: { templateId: id, user: userId },
          session,
          populatePaths: [
            { path: 'socials' },
            { path: 'businessCategories' },
            { path: 'languages' },
            { path: 'meetingInstance' },
            { path: 'previewUrls' },
            { path: 'user', populate: { path: 'profileAvatar' } },
          ],
        });

        return plainToInstance(UserTemplateDTO, userTemplate, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      } catch (err) {
        throw new RpcException({
          message: err.message,
          ctx: TEMPLATES_SERVICE,
        });
      }
    });
  }

  @MessagePattern({ cmd: UserTemplatesBrokerPatterns.CreateUserTemplate })
  async createMeetingTemplate(
    @Payload() { id, userId }: CreateUserTemplateByIdPayload,
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        const targetTemplate =
          await this.commonTemplatesService.findCommonTemplateById({
            templateId: id,
            session,
          });

        const user = await this.usersService.findById(userId, session);

        await user.populate(['socials', 'languages', 'templates']);

        const templateData = {
          user: user._id,
          templateId: targetTemplate.templateId,
          author: targetTemplate.author,
          url: targetTemplate.url,
          name: targetTemplate.name,
          maxParticipants: targetTemplate.maxParticipants,
          previewUrls: targetTemplate.previewUrls,
          type: targetTemplate.type,
          priceInCents: targetTemplate.priceInCents,
          description: targetTemplate.description,
          shortDescription: targetTemplate.shortDescription,
          usersPosition: targetTemplate.usersPosition,
          usersSize: targetTemplate.usersPosition.map(() => 0),
          indexUsers: targetTemplate.usersPosition.map(() => null),
          isAudioAvailable: targetTemplate.isAudioAvailable,
          links: targetTemplate.links,
          isPublic: targetTemplate.isPublic,
          businessCategories: targetTemplate.businessCategories.map(
            (category) => category._id,
          ),
          fullName: user.fullName,
          position: user.position,
          companyName: user.companyName,
          contactEmail: user.contactEmail,
          languages: user.languages.map((language) => language._id),
          socials: user.socials.map((social) => social._id),
          signBoard: user.signBoard,
          templateType: targetTemplate.templateType,
          roomType: targetTemplate.roomType,
          subdomain: targetTemplate.subdomain,
          mediaLink: targetTemplate.mediaLink,
        };

        const [userTemplate] =
          await this.userTemplatesService.createUserTemplate(
            templateData,
            session,
          );
        user.templates.push(userTemplate);

        await user.save({ session: session.session });

        const isRoomStatisticsExists = await this.roomStatisticService.exists({
          query: {
            _id: targetTemplate._id,
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
          query: { user: user._id },
          data: {
            $inc: { roomsUsed: 1 },
          },
          session,
        });

        const mediaCategory = await this.getMyRoomMediaCategory(session);
        const url = userTemplate.mediaLink
          ? userTemplate.mediaLink.src
          : userTemplate.url;

        await this.mediaService.createMedia({
          data: {
            userTemplate,
            url,
            previewUrls: userTemplate.previewUrls,
            templateId: userTemplate.templateId,
            mediaCategory,
            ...(userTemplate.mediaLink && {
              thumb: userTemplate.mediaLink.thumb,
            }),
            type: userTemplate.templateType,
          },
          session,
        });

        return plainToInstance(UserTemplateDTO, userTemplate, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      } catch (err) {
        console.log(err);

        throw new RpcException({
          message: err.message,
          ctx: TEMPLATES_SERVICE,
        });
      }
    });
  }

  @MessagePattern({ cmd: UserTemplatesBrokerPatterns.GetUserTemplateById })
  async getUserTemplateById(
    @Payload() { id }: GetUserTemplateByIdPayload,
  ): Promise<IUserTemplate> {
    return withTransaction(this.connection, async (session) => {
      try {
        const userTemplate = await this.userTemplatesService.findUserTemplate({
          query: isValidObjectId(id) ? { _id: id } : { customLink: id },
          session,
          populatePaths: [
            { path: 'socials' },
            { path: 'businessCategories' },
            { path: 'languages' },
            { path: 'meetingInstance' },
            { path: 'previewUrls' },
            { path: 'user', populate: { path: 'profileAvatar' } },
          ],
        });

        return plainToInstance(UserTemplateDTO, userTemplate, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      } catch (err) {
        throw new RpcException({
          message: err.message,
          ctx: TEMPLATES_SERVICE,
        });
      }
    });
  }

  @MessagePattern({ cmd: UserTemplatesBrokerPatterns.GetUserTemplates })
  async getUserTemplates(
    @Payload()
    {
      userId,
      categoryType,
      skip,
      limit,
      sort,
      direction,
    }: GetUserTemplatesPayload,
  ): Promise<EntityList<IUserTemplate>> {
    try {
      return withTransaction(this.connection, async (session) => {
        const aggregationPipeline: mongoose.PipelineStage[] = [
          {
            $match: {
              user: new mongoose.Types.ObjectId(userId),
              categoryType: categoryType || <TemplateCategoryType>'default',
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'user',
            },
          },
          ...this.commonTemplatesService.joinCommonTemplatePropertiesQueries(),
          {
            $set: {
              author: {
                $first: '$author',
              },
              user: {
                $first: '$user',
              },
              authorThumbnail: {
                $first: '$author.profileAvatar.url',
              },
              authorRole: {
                $first: '$author.role',
              },
              authorName: {
                $first: '$author.fullName',
              },
            },
          },
        ];

        if (sort) {
          aggregationPipeline.push({
            $sort: { [sort]: (direction as 1 | -1) || 1 },
          });
        }

        if (skip) {
          aggregationPipeline.push({ $skip: skip * limit });
        }

        if (limit) {
          aggregationPipeline.push({ $limit: limit });
        }

        const userTemplates = await this.userTemplatesService.aggregate(
          aggregationPipeline,
          session,
        );

        const userTemplatesCount =
          await this.userTemplatesService.countUserTemplates({
            user: new mongoose.Types.ObjectId(userId),
            categoryType: categoryType || <TemplateCategoryType>'default',
          });

        const parsedTemplates = plainToInstance(
          UserTemplateDTO,
          userTemplates,
          {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          },
        );

        return {
          list: parsedTemplates,
          count: userTemplatesCount,
        };
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: UserTemplatesBrokerPatterns.UpdateUserTemplate })
  async updateUserTemplate(
    @Payload()
    { templateId, userId, data }: UpdateUserTemplatePayload,
  ): Promise<IUserTemplate> {
    return withTransaction(this.connection, async (session) => {
      try {
        const template = await this.userTemplatesService.findById({
          id: templateId,
          session,
          populatePaths: 'user',
        });

        const updateTemplateData = {
          fullName: data.fullName,
          position: data.position,
          usersPosition: data.usersPosition,
          usersSize: data.usersSize,
          indexUsers: data.indexUsers,
          companyName: data.companyName,
          contactEmail: data.contactEmail,
          description: data.description,
          signBoard: data.signBoard,
          customLink: data.customLink,
          name: data.name,
          isPublic: data.isPublic,
          maxParticipants: data.maxParticipants,
          mediaLink: data.mediaLink,
          url: data.url,
          previewUrls: data.previewUrls,
          draftUrl: data.draftUrl,
          links: data.links,
          templateType: data.templateType,
        } as UpdateQuery<UserTemplateDocument>;

        console.log('update template', updateTemplateData);
        

        if ('businessCategories' in data) {
          const promises = data.businessCategories.map(async (category) => {
            const [existingCategory] =
              await this.businessCategoriesService.find({
                query: { key: category.key },
                session,
              });

            if (existingCategory) {
              return existingCategory;
            }

            return this.businessCategoriesService.create({
              data: {
                key: category.key,
                value: category.value,
                color: category.color,
                icon: category.icon,
              },
              session,
            });
          });

          updateTemplateData.businessCategories = (
            await Promise.all(promises)
          ).map((category) => category._id);
        }

        if ('languages' in data) {
          const newLanguages = await this.languageService.find({
            query: { key: { $in: data.languages || [] } },
            session,
          });

          updateTemplateData.languages = newLanguages.map(
            (language) => language._id,
          );
        }
        if ('socials' in data) {
          const newSocials =
            await this.userTemplatesService.createUserTemplateSocialsLinks(
              { userId: template.user._id, socials: data.socials || [] },
              session,
            );

          updateTemplateData.socials = newSocials.map((social) => social._id);
        }

        const filteredData = Object.fromEntries(
          Object.entries(updateTemplateData).filter(
            (entry) => entry[1] !== undefined,
          ),
        );

        const userTemplate =
          await this.userTemplatesService.findUserTemplateByIdAndUpdate(
            templateId,
            filteredData,
            session,
            [
              { path: 'socials' },
              { path: 'businessCategories' },
              { path: 'languages' },
              { path: 'meetingInstance' },
              { path: 'previewUrls' },
              { path: 'author' },
              { path: 'user', populate: 'profileAvatar' },
            ],
          );

        if (userTemplate?.author?._id?.toString?.() === userId) {
          const updateCommonTemplateData = {
            ...filteredData,
            isPublic: userTemplate.isPublic,
          };

          const myRoomCategory = await this.getMyRoomMediaCategory(session);
          await this.mediaService.updateMedia({
            query: {
              mediaCategory: myRoomCategory._id,
              userTemplate: userTemplate._id,
            },
            data: {
              url: data.mediaLink ? data.mediaLink.src : userTemplate.url,
              thumb: data.mediaLink ? data.mediaLink.thumb : null,
              previewUrls: data.mediaLink ? [] : userTemplate.previewUrls,
              type: userTemplate.templateType,
            },
            session,
          });

          await this.commonTemplatesService.updateCommonTemplate({
            query: {
              templateId: userTemplate.templateId,
            },
            data: updateCommonTemplateData,
            session,
          });
        }

        return plainToInstance(UserTemplateDTO, userTemplate, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      } catch (err) {
        throw new RpcException({
          message: err.message,
          ctx: TEMPLATES_SERVICE,
        });
      }
    });
  }

  @MessagePattern({ cmd: UserTemplatesBrokerPatterns.UploadUserTemplateFile })
  async uploadUserTemplateFile(
    @Payload()
    data: {
      url: IUserTemplate['url'];
      id: IUserTemplate['id'];
      mimeType: string;
    },
  ) {
    return withTransaction(this.connection, async (session) => {
      const { url, id, mimeType } = data;

      const previewImages = await this.userTemplatesService.generatePreviews({
        url,
        id,
        mimeType,
      });

      const imageIds = previewImages.map((image) => image._id);

      const userTemplate = await this.userTemplatesService.findById({
        id,
        session,
      });

      await this.commonTemplatesService.updateCommonTemplate({
        query: {
          templateId: userTemplate.templateId,
        },
        data: {
          templateType: mimeType.includes('image') ? 'image' : 'video',
          draftPreviewUrls: imageIds,
          draftUrl: url,
        },
        session,
      });

      const template = await this.userTemplatesService.updateUserTemplate({
        query: {
          _id: id,
        },
        data: {
          templateType: mimeType.includes('image') ? 'image' : 'video',
          draftPreviewUrls: imageIds,
          draftUrl: url,
        },
        session,
        populatePaths: ['draftPreviewUrls'],
      });

      return plainToInstance(UserTemplateDTO, template, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    });
  }

  @MessagePattern({ cmd: UserTemplatesBrokerPatterns.GetUsersTemplates })
  async getUsersTemplates(
    @Payload()
    { userId, skip, limit, direction, sort }: GetUsersTemplatesPayload,
  ): Promise<EntityList<IUserTemplate>> {
    try {
      return withTransaction(this.connection, async (session) => {
        const user = await this.usersService.findById(userId, session);

        const userTemplates = await this.userTemplatesService.findUserTemplates(
          {
            query: { user: { $ne: user } },
            options: { sort: { [sort]: direction }, skip, limit },
            populatePaths: [
              { path: 'businessCategories' },
              { path: 'previewUrls' },
              { path: 'user', populate: { path: 'profileAvatar' } },
            ],
            session,
          },
        );

        const userTemplatesCount =
          await this.userTemplatesService.countUserTemplates({
            user: { $ne: user },
          });

        const parsedTemplates = plainToInstance(
          UserTemplateDTO,
          userTemplates,
          {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          },
        );

        return {
          list: parsedTemplates,
          count: userTemplatesCount,
        };
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }

  @MessagePattern({
    cmd: UserTemplatesBrokerPatterns.DeleteGlobalUserTemplates,
  })
  async deleteUserTemplates(
    @Payload() { userId }: DeleteGlobalUserTemplatesPayload,
  ) {
    return withTransaction(
      this.connection,
      async (session: ITransactionSession) => {
        try {
          const userTemplates =
            await this.userTemplatesService.findUserTemplates({
              query: {
                user: new ObjectId(userId),
              },
              session,
            });
          await this.deleteMedias(
            {
              userTemplate: {
                $in: userTemplates,
              },
            },
            session,
          );

          await this.userTemplatesComponent.deleteUserTemplatesByUserId(
            userId,
            session,
          );
        } catch (err) {
          throw new RpcException({
            message: err.message,
            ctx: TEMPLATES_SERVICE,
          });
        }
      },
    );
  }

  @MessagePattern({
    cmd: UserTemplatesBrokerPatterns.GetTemplatePayment,
  })
  async getTemplatePayment(
    @Payload()
    { userTemplateId, paymentType, meetingRole }: GetTemplatePaymentPayload,
  ) {
    return withTransaction<TemplatePaymentDto>(
      this.connection,
      async (session) => {
        try {
          const templatePayment = await this.templatePaymentsComponent.findOne({
            query: {
              userTemplate: new ObjectId(userTemplateId),
              type: paymentType,
              meetingRole,
            },
            session,
            populatePaths: 'userTemplate',
          });

          throwRpcError(
            !templatePayment.enabled,
            TemplateNativeErrorEnum.TEMPLATE_PAYMENT_DISABLED,
          );

          return templatePaymentSerialization(templatePayment);
        } catch (err) {
          throw new RpcException({
            message: err.message,
            ctx: TEMPLATES_SERVICE,
          });
        }
      },
    );
  }

  @MessagePattern({
    cmd: UserTemplatesBrokerPatterns.GetTemplatePayments,
  })
  async getTemplatePayments(
    @Payload() { userTemplateId }: GetTemplatePaymentsPayload,
  ) {
    return withTransaction<EntityList<TemplatePaymentDto>>(
      this.connection,
      async (session) => {
        try {
          const userTemplate = await this.userTemplatesComponent.findOne(
            isValidObjectId(userTemplateId)
              ? { _id: new ObjectId(userTemplateId) }
              : { customLink: userTemplateId },
            session,
          );

          const query = {
            userTemplate: userTemplate._id,
          };
          const templatePayments =
            await this.templatePaymentsComponent.findMany({
              query,
              session,
            });

          const countTemplatePayments =
            await this.templatePaymentsService.count(query);

          const plainTemplatePayments =
            templatePaymentSerialization(templatePayments);
          return {
            list: plainTemplatePayments,
            count: countTemplatePayments,
          };
        } catch (err) {
          throw new RpcException({
            message: err.message,
            ctx: TEMPLATES_SERVICE,
          });
        }
      },
    );
  }

  @MessagePattern({ cmd: UserTemplatesBrokerPatterns.DeleteUsersTemplate })
  async deleteUserTemplate(
    @Payload() { templateId, userId }: DeleteUsersTemplatesPayload,
  ) {
    try {
      return withTransaction(this.connection, async (session) => {
        const userTemplate = await this.userTemplatesService.findById({
          id: templateId,
          session,
          populatePaths: 'author',
        });

        if (!userTemplate) {
          return;
        }

        if (userTemplate?.author?._id?.toString?.() === userId) {
          const commonTemplate =
            await this.commonTemplatesService.updateCommonTemplate({
              query: {
                templateId: userTemplate.templateId,
              },
              data: {
                isDeleted: true,
                isPublic: false,
              },
              session,
            });
          await this.roomStatisticService.delete({
            query: {
              template: commonTemplate._id,
            },
            session,
          });
        }

        await this.deleteMedias({ userTemplate }, session);

        await this.userTemplatesComponent.deleteUserTemplate(
          { _id: templateId },
          session,
        );

        return;
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: UserTemplatesBrokerPatterns.CountUserTemplates })
  async countUserTemplates(
    @Payload() { options, userId }: CountUserTemplatesPayload,
  ): Promise<{ count: number }> {
    try {
      const userTemplatesCount =
        await this.userTemplatesService.countUserTemplates({
          user: userId,
          type: options.templateType,
          author: { $ne: userId },
        });

      return {
        count: userTemplatesCount,
      };
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }

  @MessagePattern({
    cmd: UserTemplatesBrokerPatterns.UploadProfileTemplateFile,
  })
  async uploadProfileTemplateFile(
    @Payload() data: { url: string; id: string; mimeType: string },
  ) {
    return withTransaction(this.connection, async (session) => {
      const { url, id, mimeType } = data;

      const previewImages = await this.userTemplatesService.generatePreviews({
        url,
        id,
        mimeType,
      });

      const imageIds = previewImages.map((image) => image._id);

      await this.userTemplatesService.updateUserTemplate({
        query: {
          _id: id,
        },
        data: {
          templateType: mimeType.includes('image') ? 'image' : 'video',
          draftPreviewUrls: imageIds,
          draftUrl: url,
        },
        session,
      });

      return {};
    });
  }

  @MessagePattern({
    cmd: UserTemplatesBrokerPatterns.UpdateUserTemplateUsageNumber,
  })
  async updateUserTemplateUsageNumber(
    @Payload() payload: UpdateUserTemplateUsageNumberPayload,
  ) {
    try {
      return withTransaction(this.connection, async (session) => {
        await this.userTemplatesService.findUserTemplateByIdAndUpdate(
          payload.templateId,
          {
            $inc: { timesUsed: payload.value },
          },
          session,
        );

        return {};
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: UserTemplatesBrokerPatterns.DeleteLeastUsedTemplates })
  async deleteLeastUsedTemplates(
    @Payload() payload: DeleteLeastUsedTemplatesPayload,
  ): Promise<void> {
    try {
      return withTransaction(this.connection, async (session) => {
        const leastUsedFreeTemplates =
          await this.userTemplatesService.findUserTemplates({
            query: {
              type: 'free',
              user: payload.userId,
              isPublic: true,
              draft: false,
            },
            options: { sort: { usedAt: -1 }, limit: payload.templatesLimit },
            session,
          });

        const customTemplates =
          await this.userTemplatesService.findUserTemplates({
            query: {
              author: payload.userId,
            },
            session,
          });

        const paidTemplates = await this.userTemplatesService.findUserTemplates(
          {
            query: {
              type: 'paid',
            },
            session,
          },
        );

        const templatesIds = [
          ...paidTemplates,
          ...customTemplates,
          ...leastUsedFreeTemplates,
        ].map((template) => template.id);

        await this.userTemplatesComponent.deleteLeastUserTemplates(
          {
            templatesIds,
            userId: payload.userId,
          },
          session,
        );
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }

  @MessagePattern({
    cmd: UserTemplatesBrokerPatterns.UpdateTemplatePayments,
  })
  async updateUserTemplatePayment(
    @Payload() { userTemplateId, data, userId }: UpdateTemplatePaymentPayload,
  ): Promise<EntityList<ITemplatePayment>> {
    return withTransaction(this.connection, async (session) => {
      try {
        const template = await this.userTemplatesComponent.findById(
          userTemplateId,
          session,
        );

        throwRpcError(
          template.user.toString() !== userId,
          TemplateNativeErrorEnum.NOT_TEMPLATE_OWNER,
        );

        const query: FilterQuery<TemplatePaymentDocument> = {
          userTemplate: template._id,
          type: {
            $in: Object.keys(data),
          },
        };

        const templatePayments = await this.templatePaymentsService.find({
          query,
          session,
        });

        const countTemplatePayments = await this.templatePaymentsService.count(
          query,
        );

        const promises: Promise<TemplatePaymentDocument>[] = [];

        if (templatePayments.length) {
          const p = templatePayments.map(async ({ type, _id, meetingRole }) => {
            return this.templatePaymentsComponent.findOneAndUpdate({
              query: {
                _id,
                type,
                meetingRole,
              },
              data: {
                ...data[type][meetingRole],
              },
              session,
            });
          });
          promises.push(...p);
        }

        const plainTemplatePayments = templatePaymentSerialization(
          await Promise.all(promises),
        );

        return {
          list: plainTemplatePayments,
          count: countTemplatePayments,
        };
      } catch (err) {
        throw new RpcException({
          message: err.message,
          ctx: TEMPLATES_SERVICE,
        });
      }
    });
  }
}
