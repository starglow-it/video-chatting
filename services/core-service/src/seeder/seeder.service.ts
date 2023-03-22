import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

// shared
import {
  LANGUAGES_TAGS,
  BUSINESS_CATEGORIES,
  monetizationStatisticsData,
} from 'shared-const';
import { Counters, UserRoles } from 'shared-types';

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

// utils

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
    private transcodeService: TranscodeService,
    @InjectModel(PreviewImage.name)
    private previewImage: Model<PreviewImageDocument>,
  ) { }

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

  //TODO: Seed create global common template
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
    if (globalCommonTemplate) return;

    await this.commonTemplatesService.createCommonTemplate({
      data: {
        author: admin._id,
        draft: false,
        isPublic: true,
        maxParticipants: 4,
        description: 'Global Room',
        name: 'Global Theliveoffice',
        isAcceptNoLogin: true,
        url: 'https://img.freepik.com/free-vector/realistic-blurred-spring-background_52683-55622.jpg'
      }
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
      query: { name: "Spaceballs" },
      data: {
        links: [
          {
            item: "https://pizzahut.com/",
            position: {
              top: 0.86,
              left: 0.33,
            }
          }
        ]
      }
    });

    await this.userTemplatesService.updateUserTemplates({
      query: { name: "Spaceballs" },
      data: {
        links: [
          {
            item: "https://pizzahut.com/",
            position: {
              top: 0.86,
              left: 0.33,
            }
          }
        ]
      }
    });
  }

  async migrateToWebp(): Promise<void> {
    const imagesCache = [];

    const commonTemplates = await this.commonTemplatesService.findCommonTemplates({
      query: {},
      populatePaths: ['previewUrls'],
    });

    const userTemplates = await this.userTemplatesService.findUserTemplates({
      query: {},
      populatePaths: ['previewUrls'],
    });

    const promises = [...userTemplates, ...commonTemplates].map((template) => async () => {
      const imagePromises = template?.previewUrls?.map((image) => async () => {
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
              uploadKey: newKey
            });

            const fileData = await this.transcodeService.getFileData({ url: newImageUrl });

            const updateData = {
              url: newImageUrl,
              size: fileData.size,
              mimeType: 'image/webp',
              key: newKey
            };

            imagesCache.push(image._id);

            return this.previewImage.updateOne({ _id: image._id }, { $set: updateData });
          }

          return;
        }

        return;
      })

      return executePromiseQueue(imagePromises);
    });

    await executePromiseQueue(promises);

    return;
  }
}
