import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as path from 'path';
import { InjectModel } from '@nestjs/mongoose';
import * as mkdirp from 'mkdirp';
import * as fsPromises from 'fs/promises';
import * as uuid from 'uuid';

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
import { PaymentsService } from '../payments/payments.service';
import { getScreenShots } from '../utils/images/getScreenShots';
import { executePromiseQueue } from '../utils/executePromiseQueue';

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
    try {
      const promises = templatesData.map(
        ({ imagesUrl, videoPath, imagePath, ...templateData }) =>
          async () => {
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

              if (videoPath) {
                const videoFile = path.join(
                  __dirname,
                  '../../../../files',
                  videoPath,
                );

                const outputPath = path.join(
                  __dirname,
                  '../../../../images',
                  imagePath,
                );

                await mkdirp(outputPath);

                await getScreenShots(
                  videoFile,
                  path.join(outputPath, imagePath),
                );
              }

              const files = path.join(
                __dirname,
                '../../../../images',
                imagesUrl || imagePath,
              );

              const imagesPaths = await fsPromises.readdir(files);

              const uploadedImagesPromises = imagesPaths.map(async (image) => {
                const resolution = image.match(/_(\d*)p\./);
                const file = await fsPromises.readFile(`${files}/${image}`);
                const fileStats = await fsPromises.stat(`${files}/${image}`);
                const uploadKey = `templates/${templateData.type}${
                  imagesUrl || videoPath
                }/${uuid.v4()}/${image}`;

                const imageLink = await this.awsService.uploadFile(
                  file,
                  uploadKey,
                );

                await this.previewImage.deleteMany({
                  key: new RegExp(
                    `^templates/${templateData.type}${imagesUrl || videoPath}$`,
                  ),
                });

                await this.awsService.deleteResource(
                  `templates/${templateData.type}${imagesUrl || videoPath}`,
                );

                return this.previewImage.create({
                  url: imageLink,
                  size: fileStats.size,
                  mimeType: 'image/png',
                  key: uploadKey,
                  resolution: resolution?.[1],
                });
              });

              const previewUrls = await Promise.all(uploadedImagesPromises);

              const imageIds = previewUrls.map((image) => image._id);

              const createData = {
                ...templateData,
                previewUrls: imageIds,
                businessCategories: templateBusinessCategories.map((category) =>
                  category._id.toString(),
                ),
                stripeProductId: null,
              };

              if (templateData.type === 'paid') {
                const stripeProduct =
                  await this.paymentsService.createTemplateStripeProduct({
                    name: templateData.name,
                    description: templateData.shortDescription,
                    priceInCents: templateData.priceInCents,
                  });

                createData.stripeProductId = stripeProduct.id;
              }
              await this.commonTemplatesService.createCommonTemplate(
                createData,
              );
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
                  url: templateData.url,
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
