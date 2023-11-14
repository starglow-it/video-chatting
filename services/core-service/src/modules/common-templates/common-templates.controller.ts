import { Controller } from '@nestjs/common';
import { Connection, PipelineStage } from 'mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { InjectConnection } from '@nestjs/mongoose';
import { Types } from 'mongoose';

const ObjectId = Types.ObjectId;

//  const
import {
  CUSTOM_CATEROFY_BUSSINESS,
  MediaNativeErrorEnum,
  TEMPLATES_SERVICE,
  TemplateBrokerPatterns,
} from 'shared-const';

// dtos
import { CommonTemplateDTO } from '../../dtos/common-template.dto';
import { UserTemplateDTO } from '../../dtos/user-template.dto';

// services
import { CommonTemplatesService } from './common-templates.service';
import { UsersService } from '../users/users.service';
import { UserTemplatesService } from '../user-templates/user-templates.service';
import { BusinessCategoriesService } from '../business-categories/business-categories.service';
import { UserProfileStatisticService } from '../user-profile-statistic/user-profile-statistic.service';
import { RoomsStatisticsService } from '../rooms-statistics/rooms-statistics.service';
import { AwsConnectorService } from '../../services/aws-connector/aws-connector.service';
import { PaymentsService } from '../../services/payments/payments.service';
import { ConfigClientService } from '../../services/config/config.service';

// helpers
import {
  ITransactionSession,
  withTransaction,
} from '../../helpers/mongo/withTransaction';
import { MediaService } from '../medias/medias.service';
import { MediaCategoryDocument } from '../../schemas/media-category.schema';
import {
  AddTemplateToUserPayload,
  CreateTemplatePayload,
  DeleteCommonTemplatePayload,
  EditTemplatePayload,
  GetCommonTemplateByIdPayload,
  GetCommonTemplatePayload,
  GetCommonTemplatesPayload,
  UploadTemplateFilePayload,
  UserRoles,
} from 'shared-types';
import { ICommonTemplate } from 'shared-types';
import { EntityList } from 'shared-types';
import { PriceValues } from 'shared-types';
import { TemplatePaymentsService } from '../template-payments/template-payments.service';
import { UserTemplatesComponent } from '../user-templates/user-templates.component';
import { throwRpcError } from 'src/utils/common/throwRpcError';

@Controller('common-templates')
export class CommonTemplatesController {
  vultrUploadBucket: string;

  constructor(
    @InjectConnection() private connection: Connection,
    private commonTemplatesService: CommonTemplatesService,
    private userTemplatesService: UserTemplatesService,
    private usersService: UsersService,
    private businessCategoriesService: BusinessCategoriesService,
    private roomStatisticService: RoomsStatisticsService,
    private userProfileStatisticService: UserProfileStatisticService,
    private awsService: AwsConnectorService,
    private configService: ConfigClientService,
    private paymentService: PaymentsService,
    private mediaService: MediaService,
    private readonly userTemplatesComponent: UserTemplatesComponent,
    private readonly templatePaymentsService: TemplatePaymentsService,
  ) {}

  async onModuleInit() {
    this.vultrUploadBucket = await this.configService.get<string>(
      'vultrUploadBucket',
    );
  }

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

      throwRpcError(
        !mediaCategory,
        MediaNativeErrorEnum.MY_ROOM_CATEGORY_NOT_FOUND,
      );

      return mediaCategory;
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.GetCommonTemplates })
  async getCommonTemplates(
    @Payload()
    { query: { businessCategories, ...q }, options }: GetCommonTemplatesPayload,
  ): Promise<EntityList<ICommonTemplate>> {
    const skipQuery = options?.skip || 0;
    const limitQuery = options?.limit || 6;
    try {
      const sort: PipelineStage = {
        $sort: { ...(options?.sort ?? {}), _id: -1 },
      };

      const joinDraftPreviewImages: PipelineStage = {
        $lookup: {
          from: 'previewimages',
          localField: 'draftPreviewUrls',
          foreignField: '_id',
          as: 'draftPreviewUrls',
        },
      };

      const joinUserTemplate = {
        $lookup: {
          from: 'usertemplates',
          localField: 'templateId',
          foreignField: 'templateId',
          pipeline: [{ $match: { user: new ObjectId(options.userId) } }],
          as: 'userTemplate',
        },
      };
      return withTransaction(this.connection, async () => {
        const matchQuery = {
          ...q,
          ...(businessCategories && {
            businessCategories: {
              $elemMatch: {
                $in: businessCategories?.map((item) => new ObjectId(item)),
              },
            },
          }),
        };

        const aggregationPipeline: PipelineStage[] = [
          sort,
          {
            $match: matchQuery,
          },
          ...this.commonTemplatesService.joinCommonTemplatePropertiesQueries(),
          joinDraftPreviewImages,
          joinUserTemplate,
          {
            $set: {
              author: {
                $first: '$author',
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
          {
            $skip: skipQuery * limitQuery,
          },
          {
            $limit: limitQuery,
          },
        ];

        const commonTemplates = await this.commonTemplatesService.aggregate(
          aggregationPipeline,
        );

        const total = await this.commonTemplatesService.countCommonTemplates({
          query: matchQuery,
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
          count: total,
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
    @Payload() { templateId }: GetCommonTemplateByIdPayload,
  ): Promise<ICommonTemplate> {
    try {
      return withTransaction(this.connection, async (session) => {
        const commonTemplate =
          await this.commonTemplatesService.findCommonTemplateById({
            templateId,
            session,
            populatePaths: [
              'businessCategories',
              'previewUrls',
              'draftPreviewUrls',
              'author',
              'links',
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
            populatePaths: ['businessCategories', 'previewUrls', 'author'],
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
    try {
      return withTransaction(this.connection, async (session) => {
        const targetTemplate =
          await this.commonTemplatesService.findCommonTemplate({
            query: { _id: data.templateId },
            session,
            populatePaths: 'businessCategories',
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
          usersSize: targetTemplate.usersPosition.map(() => 0),
          indexUsers: targetTemplate.usersPosition.map(() => null),
          isAudioAvailable: targetTemplate.isAudioAvailable,
          links: targetTemplate.links,
          signBoard: targetUser.signBoard,
          author: targetTemplate.author,
          isAcceptNoLogin:
            targetUser.role === UserRoles.Anonymous
              ? true
              : targetTemplate.isAcceptNoLogin,
          roomType: targetTemplate.roomType,
          subdomain: targetTemplate.subdomain,
          mediaLink: targetTemplate.mediaLink,
          categoryType: targetTemplate.categoryType,
        };

        const userTemplate =
          await this.userTemplatesComponent.createUserTemplate(
            templateData,
            session,
          );
        targetUser.templates.push(userTemplate);

        await targetUser.save({ session: session?.session });

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
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.UploadTemplateFile })
  async uploadTemplateFile(
    @Payload() payload: UploadTemplateFilePayload,
  ): Promise<void> {
    try {
      return withTransaction(this.connection, async (session) => {
        const { url, id, mimeType } = payload;

        const previewImages =
          await this.commonTemplatesService.generatePreviews({
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
          session,
        });

        return;
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.CreateTemplate })
  async createTemplate(@Payload() data: CreateTemplatePayload) {
    try {
      return withTransaction(this.connection, async (session) => {
        const { userId, roomType, categoryType } = data;
        const template = await this.commonTemplatesService.createCommonTemplate(
          {
            data: {
              author: userId as any,
              ...(roomType && {
                roomType,
              }),
              ...(categoryType && {
                categoryType,
              }),
            },
            session,
          },
        );

        return plainToInstance(CommonTemplateDTO, template, {
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

  @MessagePattern({ cmd: TemplateBrokerPatterns.UpdateTemplate })
  async editTemplate(@Payload() { templateId, data }: EditTemplatePayload) {
    try {
      return withTransaction(this.connection, async (session) => {
        const { businessCategories, ...restData } = data;

        const template =
          await this.commonTemplatesService.findCommonTemplateById({
            templateId,
            populatePaths: ['previewUrls'],
            session,
          });

        const updateData: Parameters<
          typeof this.commonTemplatesService.updateCommonTemplate
        >[0]['data'] = restData;

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
                data: {
                  key: category.key,
                  value: category.value,
                  color: category.color,
                  icon: category.icon,
                },
                session,
              });
            }) ?? [],
          );

          updateData.businessCategories = businessCategoriesPromises.map(
            ({ _id }) => _id,
          );
        }

        if (updateData.type === PriceValues.Paid) {
          if (template.stripeProductId) {
            await this.paymentService.updateTemplateStripeProduct({
              productId: template.stripeProductId,
              data: {
                name: updateData.name,
                description: updateData.desciption,
                priceInCents: updateData.priceInCents,
              },
            });
          } else {
            const stripeProduct =
              await this.paymentService.createTemplateStripeProduct({
                name: updateData.name,
                priceInCents: updateData.priceInCents,
                description: updateData.description,
              });

            updateData.stripeProductId = stripeProduct.id;
          }
        }

        if (updateData.type === PriceValues.Free && template.stripeProductId) {
          this.paymentService.deleteTemplateStripeProduct({
            productId: template.stripeProductId,
          });

          updateData.stripeProductId = null;
        }

        if (updateData.url && template.url !== updateData.url) {
          const deletePreviewImagesPromises = template.previewUrls.map(
            async (preview) => {
              if (preview._id) {
                await this.commonTemplatesService.deletePreview({
                  id: preview._id,
                  session,
                });

                if (preview.key) {
                  await this.awsService.deleteResource(preview.key);
                }
              }
            },
          );

          await Promise.all(deletePreviewImagesPromises);
        }

        if (updateData.subdomain) {
          if (
            await this.commonTemplatesService.exists({
              query: {
                subdomain: updateData.subdomain,
              },
            })
          ) {
            throw new RpcException({
              message: 'Subdomain existed',
              ctx: TEMPLATES_SERVICE,
            });
          }
        }

        const updatedTemplate =
          await this.commonTemplatesService.updateCommonTemplate({
            query: {
              _id: templateId,
            },
            data: updateData,
            session,
            populatePaths: ['links'],
          });

        await this.userTemplatesService.updateUserTemplates({
          query: {
            templateId: updatedTemplate.templateId,
          },
          data: {
            description: updatedTemplate.description,
            name: updatedTemplate.name,
            usersPosition: updatedTemplate.usersPosition,
            maxParticipants: updatedTemplate.maxParticipants,
            links: updatedTemplate.links,
            templateType: updatedTemplate.templateType,
            isAudioAvailable: updatedTemplate.isAudioAvailable,
            priceInCents: updatedTemplate.priceInCents,
            type: updatedTemplate.type,
            previewUrls: updatedTemplate.previewUrls,
            businessCategories: updatedTemplate.businessCategories,
            url: updatedTemplate.url,
            mediaLink: updatedTemplate.mediaLink,
            draft: updatedTemplate.draft,
          },
          session,
        });

        const myRoomCategory = await this.getMyRoomMediaCategory(session);

        await this.mediaService.updateMedias({
          query: {
            templateId: updatedTemplate.templateId,
            mediaCategory: myRoomCategory._id,
          },
          data: {
            thumb: updatedTemplate.mediaLink
              ? updatedTemplate.mediaLink.thumb
              : null,
            previewUrls: updatedTemplate.mediaLink
              ? []
              : updatedTemplate.previewUrls,
            url: updatedTemplate.mediaLink
              ? updatedTemplate.mediaLink.src
              : updatedTemplate.url,
            type: updatedTemplate.templateType,
          },
          session,
        });

        return plainToInstance(CommonTemplateDTO, template, {
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

  @MessagePattern({ cmd: TemplateBrokerPatterns.DeleteCommonTemplate })
  async deleteCommonTemplate(
    @Payload() { templateId }: DeleteCommonTemplatePayload,
  ) {
    try {
      return withTransaction(this.connection, async (session) => {
        const template =
          await this.commonTemplatesService.findCommonTemplateById({
            templateId,
            session,
            populatePaths: [
              'author',
              'previewUrls',
              'draftPreviewUrls',
              'links',
            ],
          });

        if (!template) {
          return;
        }

        const query = { templateId: template.templateId };

        const userTemplates = await this.userTemplatesService.findUserTemplates(
          {
            query,
            session,
          },
        );

        await this.mediaService.deleteMedias({
          query: { userTemplate: { $in: userTemplates } },
        });

        await this.roomStatisticService.delete({
          query: {
            template: template._id,
          },
          session,
        });

        await this.templatePaymentsService.deleteMany({
          query: {
            userTemplate: {
              $in: userTemplates,
            },
          },
          session,
        });

        await this.userTemplatesComponent.deleteUserTemplates(query, session);

        await this.commonTemplatesService.deleteCommonTemplate({
          query: {
            _id: template._id,
          },
          session,
        });

        if (template.stripeProductId) {
          this.paymentService.deleteTemplateStripeProduct({
            productId: template.stripeProductId,
          });
        }

        const countTemplateUseCommon =
          await this.userTemplatesService.countUserTemplates({
            url: {
              $regex: `templates/videos/${template.id}`,
            },
          });

        if (countTemplateUseCommon) return;

        await this.awsService.deleteFolder(`templates/videos/${template.id}`);
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }
}
