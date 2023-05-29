import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

// shared
import {
  LANGUAGES_TAGS,
  BUSINESS_CATEGORIES,
  monetizationStatisticsData,
  TEMPLATES_SERVICE,
  FILES_SCOPE,
  MEDIA_CATEGORIES,
  USERS_SERVICE
} from 'shared-const';
import { Counters, MediaCategoryType, PlanKeys, UserRoles } from 'shared-types';

// services
import { UsersService } from '../modules/users/users.service';
import { BusinessCategoriesService } from '../modules/business-categories/business-categories.service';
import { CommonTemplatesService } from '../modules/common-templates/common-templates.service';
import { LanguagesService } from '../modules/languages/languages.service';
import { UserTemplatesService } from '../modules/user-templates/user-templates.service';
import { AwsConnectorService } from '../services/aws-connector/aws-connector.service';
import { PaymentsService } from '../services/payments/payments.service';
import { CountersService } from '../modules/counters/counters.service';
import { ConfigClientService } from '../services/config/config.service';
import { MonetizationStatisticService } from '../modules/monetization-statistic/monetization-statistic.service';
import { RoomsStatisticsService } from '../modules/rooms-statistics/rooms-statistics.service';

// schemas
import {
  PreviewImage,
  PreviewImageDocument,
} from '../schemas/preview-image.schema';
import { TranscodeService } from "../modules/transcode/transcode.service";
import { executePromiseQueue } from "shared-utils";
import { readdir, readFileSync } from 'fs';
import { join } from 'path';
import { plainToInstance } from 'class-transformer';
import { CommonTemplateDTO } from '../dtos/common-template.dto';
import { v4 as uuidv4 } from 'uuid';
import { withTransaction } from '../helpers/mongo/withTransaction';
import { InjectS3 } from 'nestjs-s3';
import { S3 } from 'aws-sdk';
import { RpcException } from '@nestjs/microservices';
import { MediaService } from '../modules/medias/medias.service';
import { MediaDocument } from '..//schemas/media.schema';

// utils

@Injectable()
export class SeederService {
  constructor(
    private commonTemplatesService: CommonTemplatesService,
    private userTemplatesService: UserTemplatesService,
    private usersService: UsersService,
    private businessCategoriesService: BusinessCategoriesService,
    private mediaService: MediaService,
    private languagesService: LanguagesService,
    private awsService: AwsConnectorService,
    private countersService: CountersService,
    private configService: ConfigClientService,
    private monetizationStatisticService: MonetizationStatisticService,
    private roomsStatisticService: RoomsStatisticsService,
    private transcodeService: TranscodeService,
    @InjectConnection() private connection: Connection,
    @InjectModel(PreviewImage.name)
    private previewImage: Model<PreviewImageDocument>,
    @InjectS3() private readonly s3: S3,
  ) { }

  async readFileAndUpload({ filePath, key }: { filePath: string, key: string }) {
    const buf = readFileSync(join(process.cwd(), filePath));

    const uploadKey = key;
    await this.awsService.deleteResource(uploadKey);
    const url = await this.awsService.uploadFile(
      buf,
      uploadKey
    );
    return url;
  }

  async generatePreviewUrls({ url, id, mimeType }) {
    const mimeTypeList = ['image', 'video', 'audio'];

    const mediaType = mimeTypeList.find(type => mimeType.includes(type));
    let previewImages = [];

    if (mediaType !== 'audio') {
      previewImages = await this.mediaService.generatePreviews({
        url,
        id,
        mimeType,
      });
    }

    return {
      previewImages,
      mediaType
    };
  }

  async seedMediaCategories() {
    try {
      const promise = MEDIA_CATEGORIES.map(async (mediaCategory) => {
        const existCategory = await this.mediaService.findMediaCategory({
          query: { key: mediaCategory.key },
        });


        if (!existCategory) {
          await this.mediaService.createCategory(
            {
              data: {
                ...mediaCategory,
                type: mediaCategory.type as MediaCategoryType
              },
            }
          );
        }
      });

      await Promise.all(promise);
    }
    catch (err) {
      console.log(err);
      return;
    }
  }

  async seedIndexsDataByUserTemplates(){
    await this.userTemplatesService.updateUserTemplates({
      query: {
        indexUsers: []
      },
      data: [{
        $set: {
          indexUsers: {
            "$map": {
              input: {
                $range: [0, "$maxParticipants"]
              },
              in: null
            }
          },
          usersSize: {
            "$map": {
              input: {
                $range: [0, "$maxParticipants"]
              },
              in: 0
            }
          }
        }
      }]
    });
  }

  async seedMyRoomMediasByUserTemplateAmount() {
    return withTransaction(this.connection, async session => {

      const mediaCategory = await this.mediaService.findMediaCategory({
        query: {
          key: 'myrooms'
        },
        session
      });

      if (!mediaCategory) {
        throw new RpcException({
          message: 'My room category not found',
          ctx: TEMPLATES_SERVICE
        });
      }

      const userTemplates = await this.userTemplatesService.aggregate([
        {
          $lookup: {
            from: "media",
            localField: "_id",
            foreignField: "userTemplate",
            as: "medias"
          }
        },
        {
          $lookup: {
            from: "mediacategories",
            localField: "medias.mediaCategory",
            foreignField: "_id",
            as: "mediaCategories"
          }
        },
        {
          $match: {
            "mediaCategories.key": {
              $ne: "myrooms"
            }
          },
        }
      ]);

      const data = userTemplates.map(userTemplate => ({
        mediaCategory,
        url: userTemplate.url,
        type: userTemplate.templateType,
        userTemplate,
        previewUrls: userTemplate.previewUrls
      })) as Partial<MediaDocument>[];

      await this.mediaService.createMedias({
        data,
        session
      })

    });
  }

  async seedBusinessCategories(): Promise<void> {
    const promises = BUSINESS_CATEGORIES.map(async (categoryItem) => {
      const isExists = await this.businessCategoriesService.exists({
        key: categoryItem.key,
      });

      if (!isExists) {
        await this.businessCategoriesService.create({ data: categoryItem });
      }
    });

    await Promise.all(promises);

    return;
  }

  async seedLanguages() {
    const promises = LANGUAGES_TAGS.map(async (language) => {
      const isExists = await this.languagesService.exists({
        key: language.key,
      });

      if (!isExists) {
        await this.languagesService.create(language);
      }
    });

    await Promise.all(promises);

    return;
  }

  async seedUpdateMaxMeetingTimeUser() {
    try {
      const plans = [PlanKeys.Business, PlanKeys.House, PlanKeys.Professional];
      await this.usersService.updateUsers({
        query: {
          subscriptionPlanKey: {
            $in: plans
          },
          maxMeetingTime: {
            $ne: null
          }
        },
        data: {
          maxMeetingTime: null
        }
      });
    }
    catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: USERS_SERVICE,
      });
    }
  }

  async createCounter() {
    const promises = Object.values(Counters).map(async (counterType) => {
      const isExists = await this.countersService.exists({
        key: counterType,
      });

      if (isExists) {
        return;
      }

      if (counterType === Counters.Templates) {
        const template = await this.commonTemplatesService.findCommonTemplate({
          query: {},
          options: {
            sort: '-templateId',
          },
        });

        await this.countersService.create({
          data: {
            key: counterType,
            value: template ? template.templateId : 1,
          },
        });
      }
    });

    await Promise.all(promises);

    return;
  }

  async seedAdminUser() {
    const adminEmail = await this.configService.get<string>('adminEmail');
    const adminPassword = await this.configService.get<string>('adminPassword');

    const admin = await this.usersService.findUser({
      query: { email: adminEmail },
    });

    if (!admin) {
      await this.usersService.createUser({
        email: adminEmail,
        password: adminPassword,
        role: UserRoles.Admin,
        isConfirmed: true,
        fullName: 'LiveOffice Admin',
        companyName: 'The LiveOffice',
        position: 'Administrator',
        contactEmail: adminEmail,
      });
    }
  }


  async updateGlobalTemplateFile(data: { url: string; id: string; mimeType: string }) {
    try {
      return withTransaction(this.connection, async () => {
        const { url, id, mimeType } = data;


        const previewImages = await this.commonTemplatesService.generatePreviews({
          url,
          id,
          mimeType,
        });


        await this.commonTemplatesService.updateCommonTemplate({
          query: {
            _id: id,
          },
          data: {
            templateType: mimeType.includes('image') ? 'image' : 'video',
            previewUrls: previewImages.map((image) => image._id),
            url,
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

  async seedCreateGlobalCommonTemplate() {
    const adminEmail = await this.configService.get<string>('adminEmail');
    const admin = await this.usersService.findUser({
      query: { email: adminEmail },
    });

    const globalCommonTemplate = await this.commonTemplatesService.findCommonTemplate({
      query: {
        isAcceptNoLogin: true
      }
    });
    if (globalCommonTemplate) {
      return;
    };


    const newCommonTemplate = plainToInstance(CommonTemplateDTO, await this.commonTemplatesService.createCommonTemplate({
      data: {
        author: admin._id,
        draft: false,
        isPublic: true,
        maxParticipants: 4,
        description: 'Global Room',
        name: 'Global Theliveoffice',
        isAcceptNoLogin: true,
        usersPosition: [{
          bottom:
            0.57,
          left:
            0.44
        },
        {
          bottom:
            0.05,
          left:
            0.44
        },
        {
          bottom:
            0.33,
          left:
            0.08
        },
        {
          bottom:
            0.3,
          left:
            0.82
        }]
      }
    }), {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    const url = await this.readFileAndUpload({
      filePath: './src/public/global_template.jpeg',
      key: `templates/${newCommonTemplate.id}/videos/${uuidv4()}.webp`
    })

    //update url to temlate
    await this.updateGlobalTemplateFile({
      url,
      id: newCommonTemplate.id.toString(),
      mimeType: 'image/webp',
    });
  }

  async seedRoomStatistic() {
    try {
      const commonTemplates =
        await this.commonTemplatesService.findCommonTemplates({
          query: {},
          populatePaths: ['author'],
        });

      const statisticPromise = commonTemplates.map(async (template) => {
        const isStatisticExists = await this.roomsStatisticService.exists({
          query: { template: template._id },
        });

        if (isStatisticExists) return;

        return this.roomsStatisticService.create({
          data: {
            template: template._id,
            author: template?.author?._id,
            transactions: 0,
            minutes: 0,
            calls: 0,
            money: 0,
            uniqueUsers: 0,
          },
        });
      });

      await Promise.all(statisticPromise);
    } catch (e) {
      console.log(e);
    }
  }

  async seedMonetizationStatistic() {
    return Promise.all(
      monetizationStatisticsData.map(async (statistic) => {
        const isStatisticExists =
          await this.monetizationStatisticService.exists({
            query: { key: statistic.key },
          });

        if (!isStatisticExists) {
          await this.monetizationStatisticService.create({
            data: {
              key: statistic.key,
              type: statistic.type,
              value: 0,
            },
          });
        }
      }),
    );
  }

  async seedLinks() {
    await this.commonTemplatesService.updateCommonTemplates({
      query: { name: 'Spaceballs' },
      data: {
        links: [
          {
            item: 'https://pizzahut.com/',
            position: {
              top: 0.86,
              left: 0.33,
            },
          },
        ],
      },
    });

    await this.userTemplatesService.updateUserTemplates({
      query: { name: 'Spaceballs' },
      data: {
        links: [
          {
            item: 'https://pizzahut.com/',
            position: {
              top: 0.86,
              left: 0.33,
            },
          },
        ],
      },
    });
  }

  async migrateToWebp(): Promise<void> {
    const imagesCache = [];

    const commonTemplates =
      await this.commonTemplatesService.findCommonTemplates({
        query: {},
        populatePaths: ['previewUrls'],
      });

    const userTemplates = await this.userTemplatesService.findUserTemplates({
      query: {},
      populatePaths: ['previewUrls'],
    });

    const promises = [...userTemplates, ...commonTemplates].map(
      (template) => async () => {
        const imagePromises = template?.previewUrls?.map(
          (image) => async () => {
            if (!imagesCache.includes(image?._id)) {
              // key - mimeType - size - url
              // url - https://ewr1.vultrobjects.com/theliveoffice-prod/templates/images/free-lake_harmony/70178d4c-a18d-4098-9e3a-fd3c419d0b29_1080p.png

              const oldKey = this.awsService.getUploadKeyFromUrl(image.url);

              this.awsService.deleteResource(oldKey);

              const fileNameMatch = image.url.match(/.*\/(.*)\..*$/);

              if (fileNameMatch) {
                const existedFileName = fileNameMatch?.[1];

                const newKey = `templates/${template._id}/images/${existedFileName}.webp`;

                const newImageUrl = await this.transcodeService.transcodeImage({
                  url: image.url,
                  uploadKey: newKey,
                });

                const fileData = await this.transcodeService.getFileData({
                  url: newImageUrl,
                });

                const updateData = {
                  url: newImageUrl,
                  size: fileData.size,
                  mimeType: 'image/webp',
                  key: newKey,
                };

                imagesCache.push(image._id);

                return this.previewImage.updateOne(
                  { _id: image._id },
                  { $set: updateData },
                );
              }

              return;
            }

            return;
          },
        );

        return executePromiseQueue(imagePromises);
      },
    );

    await executePromiseQueue(promises);

    return;
  }
}
