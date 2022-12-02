import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as path from 'path';
import { InjectModel } from '@nestjs/mongoose';
import * as mkdirp from 'mkdirp';
import * as fsPromises from 'fs/promises';

// shared
import {
  templatesData,
  LANGUAGES_TAGS,
  BUSINESS_CATEGORIES,
  monetizationStatisticsData,
} from 'shared-const';
import { Counters, UserRoles } from 'shared-types';
import {executePromiseQueue} from "shared-utils";

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

// utils
import { getScreenShots } from '../utils/images/getScreenShots';

@Injectable()
export class SeederService {
  constructor(
    private commonTemplatesService: CommonTemplatesService,
    private userTemplatesService: UserTemplatesService,
    private usersService: UsersService,
    private businessCategoriesService: BusinessCategoriesService,
    private languagesService: LanguagesService,
    private paymentsService: PaymentsService,
    private awsService: AwsConnectorService,
    private countersService: CountersService,
    private configService: ConfigClientService,
    private monetizationStatisticService: MonetizationStatisticService,
    private roomsStatisticService: RoomsStatisticsService,
    @InjectModel(PreviewImage.name)
    private previewImage: Model<PreviewImageDocument>,
  ) {}

  async seedBusinessCategories(): Promise<void> {
    const promises = BUSINESS_CATEGORIES.map(async (categoryItem) => {
      const isExists = await this.businessCategoriesService.exists({
        key: categoryItem.key,
      });

      if (!isExists) {
        await this.businessCategoriesService.create(categoryItem);
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

  async seedCommonTemplates(): Promise<void> {
    try {
      const promises = templatesData.map(
        ({ videoPath, imagePath, ...templateData }) =>
          async () => {
            const isExists = await this.commonTemplatesService.exists({
              query: {
                templateId: templateData.templateId,
              },
            });

            const templateBusinessCategories =
              await this.businessCategoriesService.find({
                query: {
                  value: {
                    $in: templateData.businessCategories,
                  },
                },
              });

            let videoFile;

            const outputPath = path.join(__dirname, '../../images', imagePath);

            if (!isExists) {
              if (videoPath) {
                videoFile = path.join(
                  __dirname,
                  '../../files',
                  `${videoPath}.mp4`,
                );

                await mkdirp(outputPath);

                await getScreenShots(videoFile, outputPath);
              }

              const images = await fsPromises.readdir(outputPath);

              await this.awsService.deleteFolder(
                `templates/images${imagePath}`,
              );

              const uploadedImagesPromises = images.map(async (image) => {
                const resolution = image.match(/(\d*)p\./);
                const file = await fsPromises.readFile(
                  `${outputPath}/${image}`,
                );
                const fileStats = await fsPromises.stat(
                  `${outputPath}/${image}`,
                );

                const uploadKey = `templates/images${imagePath}/${image}`;

                this.previewImage.deleteOne({ key: uploadKey });

                const imageLink = await this.awsService.uploadFile(
                  file,
                  uploadKey,
                );

                return this.previewImage.create({
                  url: imageLink,
                  size: fileStats.size,
                  mimeType: 'image/webp',
                  key: uploadKey,
                  resolution: resolution?.[1],
                });
              });

              const previewUrls = await Promise.all(uploadedImagesPromises);

              const imageIds = previewUrls.map((image) => image._id.toString());

              const createData = {
                ...templateData,
                previewUrls: imageIds,
                businessCategories: templateBusinessCategories.map((category) =>
                  category._id.toString(),
                ),
                stripeProductId: null,
              };

              if (templateData.type === 'paid') {
                const existingTemplateProduct =
                  await this.paymentsService.getStripeTemplateProductByName({
                    name: templateData.name,
                  });

                if (existingTemplateProduct?.id) {
                  createData.stripeProductId = existingTemplateProduct.id;
                } else {
                  const stripeProduct =
                    await this.paymentsService.createTemplateStripeProduct({
                      name: templateData.name,
                      description: templateData.shortDescription,
                      priceInCents: templateData.priceInCents,
                    });

                  createData.stripeProductId = stripeProduct.id;
                }
              }

              const newTemplate =
                await this.commonTemplatesService.createCommonTemplate({
                  data: createData,
                });

              if (videoPath) {
                const uploadKey = `templates/videos${videoPath}${videoPath}.mp4`;

                const file = await fsPromises.readFile(videoFile);

                const videoLink = await this.awsService.uploadFile(
                  file,
                  uploadKey,
                );

                await this.commonTemplatesService.updateCommonTemplate({
                  query: {
                    templateId: newTemplate.templateId,
                  },
                  data: {
                    url: videoLink,
                  },
                });
              }
            } else {
              await this.commonTemplatesService.updateCommonTemplate({
                query: {
                  templateId: templateData.templateId,
                },
                data: {
                  ...templateData,
                  businessCategories: templateBusinessCategories.map(
                    (category) => category._id.toString(),
                  ),
                },
              });

              await this.userTemplatesService.updateUserTemplate({
                query: {
                  templateId: templateData.templateId,
                },
                data: {
                  maxParticipants: templateData.maxParticipants,
                  type: templateData.type,
                  priceInCents: templateData.priceInCents,
                  isAudioAvailable: templateData.isAudioAvailable,
                  usersPosition: templateData.usersPosition,
                },
              });
            }
          },
      );

      await executePromiseQueue(promises);

      return;
    } catch (e) {
      console.log(e);
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
          key: counterType,
          value: template ? template.templateId : 1,
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
}
