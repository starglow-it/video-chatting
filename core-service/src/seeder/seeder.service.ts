import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as path from 'path';
import * as fsPromises from 'fs/promises';
import { InjectModel } from '@nestjs/mongoose';

// services
import { UsersService } from '../users/users.service';
import { BusinessCategoriesService } from '../business-categories/business-categories.service';
import { CommonTemplatesService } from '../common-templates/common-templates.service';
import { LanguagesService } from '../languages/languages.service';
import { UserTemplatesService } from '../user-templates/user-templates.service';
import { AwsConnectorService } from '../aws-connector/aws-connector.service';

// const
import { BUSINESS_CATEGORIES } from '@shared/const/business-categories.const';
import { LANGUAGES_TAGS } from '@shared/const/languages';
import { templatesData } from '@shared/const/templates';

// schemas
import {
  PreviewImage,
  PreviewImageDocument,
} from '../schemas/preview-image.schema';

@Injectable()
export class SeederService {
  constructor(
    private commonTemplatesService: CommonTemplatesService,
    private userTemplatesService: UserTemplatesService,
    private usersService: UsersService,
    private businessCategoriesService: BusinessCategoriesService,
    private languagesService: LanguagesService,
    private awsService: AwsConnectorService,
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

  async seedCommonTemplates(): Promise<void> {
    const promises = templatesData.map(
      async ({ imagesUrl, ...templateData }) => {
        const isExists = await this.commonTemplatesService.exists({
          templateId: templateData.templateId,
        });

        if (!isExists) {
          const templateBusinessCategories =
            await this.businessCategoriesService.find({
              query: {
                value: {
                  $in: templateData.businessCategories,
                },
              },
            });

          const imagesPath = path.join(__dirname, '../../../..', imagesUrl);

          const images = await fsPromises.readdir(imagesPath);

          const uploadedImagesPromises = images.map(async (image) => {
            const resolution = image.match(/_(\d*)p\./);
            const file = await fsPromises.readFile(`${imagesPath}/${image}`);
            const fileStats = await fsPromises.stat(`${imagesPath}/${image}`);
            const uploadKey = `templates${imagesUrl}/${image}`;
            const imageLink = await this.awsService.uploadFile(file, uploadKey);

            const imageFile = await this.previewImage.create({
              url: imageLink,
              size: fileStats.size,
              mimeType: 'image/png',
              key: uploadKey,
              resolution: resolution?.[1],
            });

            return imageFile._id;
          });

          const previewUrls = await Promise.all(uploadedImagesPromises);

          await this.commonTemplatesService.createCommonTemplate({
            ...templateData,
            previewUrls,
            businessCategories: templateBusinessCategories.map((category) =>
              category._id.toString(),
            ),
          });
        } else {
          const templateBusinessCategories =
            await this.businessCategoriesService.find({
              query: {
                value: {
                  $in: templateData.businessCategories,
                },
              },
            });

          await this.commonTemplatesService.updateCommonTemplate({
            query: {
              templateId: templateData.templateId,
            },
            data: {
              ...templateData,
              businessCategories: templateBusinessCategories.map((category) =>
                category._id.toString(),
              ),
            },
          });

          await this.userTemplatesService.updateUserTemplate({
            query: {
              templateId: templateData.templateId,
            },
            data: {
              url: templateData.url,
              maxParticipants: templateData.maxParticipants,
              type: templateData.type,
              isAudioAvailable: templateData.isAudioAvailable,
              usersPosition: templateData.usersPosition,
            },
          });
        }
      },
    );

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
}
