import { Controller } from '@nestjs/common';
import { Connection, PipelineStage } from 'mongoose';
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
  GetCommonTemplateByIdPayload,
  PriceValues,
} from 'shared-types';

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
import { ITransactionSession, withTransaction } from '../../helpers/mongo/withTransaction';
import { MediaService } from '../medias/medias.service';
import { MediaCategoryDocument } from 'src/schemas/media-category.schema';

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
    private mediaService: MediaService
  ) { }

  async onModuleInit() {
    this.vultrUploadBucket = await this.configService.get<string>(
      'vultrUploadBucket',
    );
  }


  private async getMyRoomMediaCategory(session: ITransactionSession): Promise<MediaCategoryDocument> {
    try {
      const mediaCategory = await this.mediaService.findMediaCategory({
        query: {
          key: 'myrooms'
        },
        session
      });

      if (!mediaCategory) {
        throw new RpcException({
          message: 'Media category not found',
          ctx: TEMPLATES_SERVICE
        });
      }

      return mediaCategory;
    }
    catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE
      });
    }
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.GetCommonTemplates })
  async getCommonTemplates(
    @Payload()
    { query, options }: GetCommonTemplatesPayload,
  ): Promise<EntityList<ICommonTemplate>> {
    try {
      const sort: PipelineStage = { $sort: { ...(options?.sort ?? {}), _id: -1 } };

      const joinDraftPreviewImages: PipelineStage = {
        $lookup: {
          from: 'previewimages',
          localField: 'draftPreviewUrls',
          foreignField: '_id',
          as: 'draftPreviewUrls',
        },
      }

      const joinUserTemplate = {
        $lookup: {
          from: 'usertemplates',
          localField: 'templateId',
          foreignField: 'templateId',
          pipeline: [{ $match: { user: new ObjectId(options.userId) } }],
          as: 'userTemplate',
        }
      }
      return withTransaction(this.connection, async () => {
        const aggregationPipeline: PipelineStage[] = [
          sort,
          { $match: query },
          ...this.commonTemplatesService.joinCommonTemplatePropertiesQueries(),
          joinDraftPreviewImages,
          joinUserTemplate,
          {
            $set: {
              author: {
                $first: "$author"
              },
              authorThumbnail: {
                $first: "$author.profileAvatar.url"
              },
              authorRole: {
                $first: "$author.role"
              },
              authorName: {
                $first: '$author.fullName'
              }
            }
          }
        ];

        if (options?.skip) {
          aggregationPipeline.push({ $skip: options.skip });
        }

        if (options?.limit) {
          aggregationPipeline.push({ $limit: options.limit });
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
          isAcceptNoLogin: targetTemplate.isAcceptNoLogin
        };

        const [userTemplate] =
          await this.userTemplatesService.createUserTemplate(
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
        });

        const mediaCategory = await this.getMyRoomMediaCategory(session);

        await this.mediaService.createMedia({
          data: {
            userTemplate,
            url: userTemplate.url,
            previewUrls: userTemplate.previewUrls,
            mediaCategory,
            type: userTemplate.templateType
          },
          session
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
      return withTransaction(this.connection, async () => {
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
        const template = await this.commonTemplatesService.createCommonTemplate(
          {
            data: {
              author: data.userId,
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

          await deletePreviewImagesPromises;
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
            draft: updatedTemplate.draft,
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
  ): Promise<undefined> {
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
        
        const userTemplates = await this.userTemplatesService.findUserTemplates({
          query,
          session
        });
        
        await this.mediaService.deleteMedias({query: {userTemplate: {$in: userTemplates }}});

        await this.roomStatisticService.delete({
          query: {
            template: template._id,
          },
          session,
        });

        await this.userTemplatesService.deleteUserTemplates({
          query,
          session,
        });

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

        const countTemplateUseCommon = await this.userTemplatesService
        .countUserTemplates({
          url: {
            $regex: `templates/videos/${template.id}`
          }
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
