import { Injectable } from '@nestjs/common';

// services
import { UsersService } from '../users/users.service';
import { BusinessCategoriesService } from '../business-categories/business-categories.service';
import { CommonTemplatesService } from '../common-templates/common-templates.service';
import { LanguagesService } from '../languages/languages.service';
import { UserTemplatesService } from '../user-templates/user-templates.service';

// const
import { BUSINESS_CATEGORIES } from '@shared/const/business-categories.const';
import { LANGUAGES_TAGS } from '@shared/const/languages';
import { templatesData } from '@shared/const/templates';

@Injectable()
export class SeederService {
  constructor(
    private commonTemplatesService: CommonTemplatesService,
    private userTemplatesService: UserTemplatesService,
    private usersService: UsersService,
    private businessCategoriesService: BusinessCategoriesService,
    private languagesService: LanguagesService,
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
    const promises = templatesData.map(async (templateData) => {
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

        await this.commonTemplatesService.createCommonTemplate({
          ...templateData,
          businessCategories: templateBusinessCategories.map(
            (category) => category._id,
          ),
        });
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
}
