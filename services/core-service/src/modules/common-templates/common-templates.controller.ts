import { Controller } from '@nestjs/common';
import { Connection, PipelineStage } from 'mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { InjectConnection } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const ObjectId = Types.ObjectId;

//  const
import {
  TEMPLATES_SERVICE,
  TemplateBrokerPatterns,
  previewResolutions,
} from 'shared-const';

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
  GetCommonTemplateByIdPayload, PriceValues,
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
import { TranscodeService } from '../transcode/transcode.service';
import { TemplateSoundService } from '../template-sound/template-sound.service';
import { AwsConnectorService } from '../../services/aws-connector/aws-connector.service';
import { PaymentsService } from '../../services/payments/payments.service';
import { ConfigClientService } from '../../services/config/config.service';

// helpers
import { withTransaction } from '../../helpers/mongo/withTransaction';

@Controller('common-templates')
export class CommonTemplatesController {
  vultrUploadBucket: string;

  constructor(
    @InjectConnection() private connection: Connection,
    private commonTemplatesService: CommonTemplatesService,
    private userTemplatesService: UserTemplatesService,
    private meetingsService: MeetingsService,
    private usersService: UsersService,
    private businessCategoriesService: BusinessCategoriesService,
    private roomStatisticService: RoomsStatisticsService,
    private userProfileStatisticService: UserProfileStatisticService,
    private transcodeService: TranscodeService,
    private templateSoundService: TemplateSoundService,
    private awsService: AwsConnectorService,
    private configService: ConfigClientService,
    private paymentService: PaymentsService,
  ) {}

  async onModuleInit() {
    this.vultrUploadBucket = await this.configService.get<string>(
      'vultrUploadBucket',
    );
  }

  @MessagePattern({ cmd: TemplateBrokerPatterns.GetCommonTemplates })
  async getCommonTemplates(
    @Payload()
    { query, options }: GetCommonTemplatesPayload,
  ): Promise<EntityList<ICommonTemplate>> {
    try {
      return withTransaction(this.connection, async () => {
        const aggregationPipeline: PipelineStage[] = [
          { $sort: { maxParticipants: 1, _id: 1 } },
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
              from: 'previewimages',
              localField: 'draftPreviewUrls',
              foreignField: '_id',
              as: 'draftPreviewUrls',
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
        ];

        if (options?.limit) {
          aggregationPipeline.push({ $limit: options.limit });
        }

        if (options?.skip) {
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
              'sound',
              'author',
              'draftSound',
              'links'
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
          isAudioAvailable: targetTemplate.isAudioAvailable,
          links: targetTemplate.links,
          signBoard: targetUser.signBoard,
          author: targetTemplate.author,
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
  ): Promise<ICommonTemplate> {
    try {
      return withTransaction(this.connection, async (session) => {
        const { url, id, mimeType, fileName, uploadKey } = payload;

        const templateType = mimeType.includes('image') ? 'image' : 'video';

        const screenShotUploadKey = `templates/${id}/images`;

        const screenShotPromises = previewResolutions.map(
          async (resolution) => {
            const screenShotData =
              await this.transcodeService.createVideoScreenShots({
                url,
                mimeType,
                key: screenShotUploadKey,
                resolution,
              });

            return this.commonTemplatesService.createPreview({
              data: {
                url: screenShotData.url,
                key: screenShotData.uploadKey,
                size: screenShotData.size,
                resolution: screenShotData.resolution,
              },
              session,
            });
          },
        );

        const updateData: Parameters<
          typeof this.commonTemplatesService.updateCommonTemplate
        >[0]['data'] = {
          templateType,
        };

        if (templateType === 'video') {
          const fileData = await this.transcodeService.getFileData({ url });

          const videoUrl = await this.transcodeService.transcodeVideo({
            url,
            key: `${uploadKey}/videos/${uuidv4()}.mp4`,
          });

          if (fileData.hasAudio) {
            const soundUrl =
                await this.transcodeService.extractTemplateSound({
                  url,
                  key: `${uploadKey}/sounds/${uuidv4()}.mp3`,
                });

            const soundData = await this.templateSoundService.create({
              data: {
                fileName,
                size: fileData.size,
                mimeType: 'audio/mpeg',
                url: soundUrl,
                uploadKey: `${uploadKey}/sounds/${uuidv4()}.mp3`
              },
              session,
            });

            updateData.sound = soundData._id;
          }

          updateData.draftUrl = videoUrl;
        } else {
          updateData.draftUrl = url;
        }

        const previewImages = await Promise.all(screenShotPromises);

        updateData.draftPreviewUrls = previewImages.map((image) => image._id);

        const updatedTemplate =
          await this.commonTemplatesService.updateCommonTemplate({
            query: {
              _id: id,
            },
            data: updateData,
            session,
            populatePaths: ['sound', 'draftPreviewUrls'],
          });

        return plainToInstance(CommonTemplateDTO, updatedTemplate, {
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

        const template = await this.commonTemplatesService.findCommonTemplateById({
          templateId,
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
              }
            });
          } else {
            const stripeProduct = await this.paymentService.createTemplateStripeProduct({
              name: updateData.name,
              priceInCents: updateData.priceInCents,
              description: updateData.description,
            });

            updateData.stripeProductId = stripeProduct.id;
          }
        }

        if (updateData.type === PriceValues.Free) {
          this.paymentService.deleteTemplateStripeProduct({
            productId: template.stripeProductId,
          });

          updateData.stripeProductId = null;
        }

        const updatedTemplate = await this.commonTemplatesService.updateCommonTemplate(
          {
            query: {
              _id: templateId,
            },
            data: updateData,
            session,
            populatePaths: ['draftSound', 'sound', 'links'],
          },
        );

        await this.userTemplatesService.updateUserTemplates({
          query: {
            meetingInstance: null,
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
            sound: updatedTemplate?.sound?._id,
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
              'sound',
              'author',
              'previewUrls',
              'draftPreviewUrls',
              'links',
            ],
          });

        if (!template) {
          return;
        }

        if (template.sound?._id) {
          this.templateSoundService.deleteSound({
            id: template.sound.id,
            session,
          });
        }

        template.previewUrls.map((preview) => {
          this.commonTemplatesService.deletePreview({
            id: preview._id,
            session,
          });
        });

        template.draftPreviewUrls.map((preview) => {
          this.commonTemplatesService.deletePreview({
            id: preview._id,
            session,
          });
        });

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

        if (template.stripeProductId) {
          this.paymentService.deleteTemplateStripeProduct({
            productId: template.stripeProductId,
          });
        }

        await this.awsService.deleteFolder(`templates/${template.id}`);
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }
}
