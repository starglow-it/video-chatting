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
    const promises = templatesData.map(async (templateData, i) => {
      const isExists = await this.commonTemplatesService.exists({
        templateId: templateData.templateId,
      });

      if (!isExists) {
        const templateBusinessCategories =
          await this.businessCategoriesService.find({
            key: {
              $in: [
                BUSINESS_CATEGORIES[i].key,
                BUSINESS_CATEGORIES[i + 1].key,
                BUSINESS_CATEGORIES[i + 2].key,
                BUSINESS_CATEGORIES[i + 3].key,
                BUSINESS_CATEGORIES[i + 4].key,
                BUSINESS_CATEGORIES[i + 5].key,
                BUSINESS_CATEGORIES[i + 6].key,
              ],
            },
          });

        const businessCategoriesObjectId = templateBusinessCategories.map(
          (category) => category._id,
        );

        await this.commonTemplatesService.createCommonTemplate({
          ...templateData,
          businessCategories: businessCategoriesObjectId,
        });
      }
    });

    await Promise.all(promises);

    return;
  }

  async seedUsersTemplates() {
    const users = await this.usersService.findUsers({
      query: {},
      populatePaths: ['socials', 'languages', 'templates'],
    });

    const templateList = await this.commonTemplatesService.findCommonTemplates({
      query: {},
      populatePaths: 'businessCategories',
    });

    const createUsersTemplates = users.map(async (user) => {
      if (!user.templates.length) {
        const templatesListData = templateList.map((template) => {
          return {
            templateId: template.templateId,
            url: template.url,
            name: template.name,
            maxParticipants: template.maxParticipants,
            previewUrl: template.previewUrl,
            type: template.type,
            businessCategories: template.businessCategories.map(
              (category) => category._id,
            ),
            fullName: user.fullName,
            position: user.position,
            description: user.description || template.description,
            companyName: user.companyName,
            contactEmail: user.contactEmail,
            languages: user.languages.map((language) => language._id),
            socials: user.socials.map((social) => social._id),
          };
        });

        const templates = await this.userTemplatesService.createUserTemplates({
          userId: user._id,
          templates: templatesListData,
        });

        user.templates = templates;

        return user.save();
      }
    });

    await Promise.all(createUsersTemplates);
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
