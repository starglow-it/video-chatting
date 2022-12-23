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
    @InjectModel(PreviewImage.name)
    private previewImage: Model<PreviewImageDocument>,
  ) {}

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
