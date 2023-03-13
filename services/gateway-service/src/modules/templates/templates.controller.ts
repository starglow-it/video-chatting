import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CommonTemplateRestDTO } from '../../dtos/response/common-template.dto';
import { EntityList, ResponseSumType, ICommonTemplate } from 'shared-types';
import { TemplatesService } from './templates.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';
import { getFileNameAndExtension } from '../../utils/getFileNameAndExtension';
import { CoreService } from '../../services/core/core.service';
import { IUserTemplate, IUpdateTemplate } from 'shared-types';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { v4 as uuidv4 } from 'uuid';
import { GetTemplatesQueryDto } from "../../dtos/query/GetTemplatesQuery.dto";

@Controller('templates')
export class TemplatesController {
  private readonly logger = new Logger();
  constructor(
    private templatesService: TemplatesService,
    private uploadService: UploadService,
    private coreService: CoreService,
  ) { }

  @Get('/')
  @ApiOperation({ summary: 'Get Templates' })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Get Templates Success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getCommonTemplates(
    @Request() req,
    @Query() query: GetTemplatesQueryDto,
  ): Promise<ResponseSumType<EntityList<ICommonTemplate>>> {
    try {
      const { skip, limit, userId, draft, isPublic, type, sort, direction } = query;

      const templatesData = await this.templatesService.getCommonTemplates({
        query: {
          isDeleted: false,
          ...(draft !== undefined ? { draft } : {}),
          ...(isPublic !== undefined ? { isPublic } : {}),
          ...(type ? { type } : {}),
        },
        options: {
          ...(sort ? { sort: { [sort]: direction } } : {}),
          skip,
          limit,
          userId,
        },
      });

      const templateHardCode: EntityList<ICommonTemplate> = {
        list: [
          {
            "id": "63fed274fbe4e34f1be79aa4",
            "description": "This is a great place to meet friends, family or even have a team meeting with colleagues in a fun and energizing setting",
            "shortDescription": "",
            "usedAt": "2023-03-10T02:18:47.037Z",
            "businessCategories": [
              {
                
                "key": "counselling",
                "value": "Counselling",
                "color": "#ea392f"
              },
              {
                
                "key": "energizing",
                "value": "Energizing",
                "color": "#b4c9e0"
              },
              {
                
                "key": "teamMeeting",
                "value": "Team meeting",
                "color": "#deb550"
              },
              {
                
                "key": "casual",
                "value": "Casual",
                "color": "#a698c0"
              }
            ],
            "templateId": 375,
            "url": "https://ewr1.vultrobjects.com/theliveoffice-prod/templates/videos/63fd5444fbe4e34f1be748d3/b0c35997-47ab-425e-97af-18d0b0198fb4.mp4",
            "name": "Central Perk Coffeeshop",
            "maxParticipants": 6,
            "previewUrls": [
              {
                "id": "63fd5455fbe4e34f1be748dc",
                "url": "https://ewr1.vultrobjects.com/theliveoffice-prod/templates/images/63fd5444fbe4e34f1be748d3/46d67593-326b-4d75-ae91-ca285af2e67c_240p.webp",
                "mimeType": "image/webp",
                "size": 14414,
                "key": "8834jsdhfjsf736",
                "resolution": 240
              },
              {
                "id": "63fd5456fbe4e34f1be748e0",
                "url": "https://ewr1.vultrobjects.com/theliveoffice-prod/templates/images/63fd5444fbe4e34f1be748d3/4a0345ac-13f6-46ed-a32e-6d602424330a_360p.webp",
                "mimeType": "image/webp",
                "size": 35946,
                "key": "8834jsdhfjsf736",
                "resolution": 360
              },
              {
                "id": "63fd5456fbe4e34f1be748e2",
                "url": "https://ewr1.vultrobjects.com/theliveoffice-prod/templates/images/63fd5444fbe4e34f1be748d3/59ccaa35-88c7-444d-bf75-65032c470c69_1080p.webp",
                "mimeType": "image/webp",
                "size": 160014,
                "key": "8834jsdhfjsf736",
                "resolution": 1080
              },
              {
                "id": "63fd5455fbe4e34f1be748de",
                "url": "https://ewr1.vultrobjects.com/theliveoffice-prod/templates/images/63fd5444fbe4e34f1be748d3/7cca72b3-ce28-4e7e-ad14-2e30311f9956_540p.webp",
                "mimeType": "image/webp",
                "size": 66920,
                "key": "8834jsdhfjsf736",
                "resolution": 540
              },
              {
                "id": "63fd5455fbe4e34f1be748da",
                "url": "https://ewr1.vultrobjects.com/theliveoffice-prod/templates/images/63fd5444fbe4e34f1be748d3/a373fb44-03f4-41b1-b5de-f06cfd844e09_720p.webp",
                "mimeType": "image/webp",
                "size": 97214,
                "key": "8834jsdhfjsf736",
                "resolution": 720
              }
            ],
            "draftPreviewUrls": [],
            "type": "free",
            "customLink": "",
            "isAudioAvailable": true,
            "priceInCents": 0,
            "usersPosition": [
              {
                "bottom": 0.52,
                "left": 0.93,
              },
              {
                "bottom": 0.52,
                "left": 0.45,
              },
              {
                "bottom": 0.52,
                "left": 0.62,
              },
              {
                "bottom": 0.79,
                "left": 0.29,
              },
              {
                "bottom": 0.5900000000000001,
                "left": 0.22,
              },
              {
                "bottom": 0.62,
                "left": 0.05,
              }
            ],
            "links": [
              {
                "item": "https://centralperk.com/",
                "position": {
                  "id": "63fd5518fbe4e34f1be748f3",
                  "top": 0.82,
                  "linkIndex": 2,
                  "left": 0.53
                }
              },
              {
                "item": "https://burtonmorriscollection.com/limitededitions",
                "position": {
                  "id": "63fd5518fbe4e34f1be748f4",
                  "top": 0.24,
                  "linkIndex": 2,
                  "left": 0.38
                }
              },
              {
                "item": "https://www.reddit.com/r/howyoudoin/",
                "position": {
                  "id": "63fd5518fbe4e34f1be748f5",
                  "top": 0.6,
                  "linkIndex": 2,
                  "left": 0.22
                }
              },
              {
                "item": "https://centralperk.com/pages/shop-coffee",
                "position": {
                  "id": "63fd5518fbe4e34f1be748f6",
                  "top": 0.79,
                  "linkIndex": 2,
                  "left": 0.74
                }
              }
            ],
            "isPublic": true,
            "templateType": "video",
            "draft": false,
            "author": "6391f2a2bb7bbb4a7dce4d4a"
          },
          {
            "id": "640083a8fbe4e34f1be83e07",
            "description": "test",
            "shortDescription": "",
            "usedAt": "2023-03-03T04:54:55.786Z",
            "businessCategories": [
              {
                "key": "adventure",
                "value": "Adventure",
                "color": "#b94dac"
              }
            ],
            "templateId": 385,
            "url": "https://ewr1.vultrobjects.com/theliveoffice-prod/templates/videos/6400833afbe4e34f1be83d25/62a27202-89d0-420b-a448-a70552a2a0bc.jpeg",
            "name": "Test office",
            "maxParticipants": 1,
            "previewUrls": [
              {
                "id": "64008362fbe4e34f1be83d37",
                "url": "https://ewr1.vultrobjects.com/theliveoffice-prod/templates/images/6400833afbe4e34f1be83d25/18f39331-73f6-40f6-9b43-7aafdde4f1e1_540p.webp",
                "mimeType": "image/webp",
                "key": "jsadhshdsakjhd",
                "size": 10916,
                "resolution": 540
              },
              {
                "id": "6400835efbe4e34f1be83d33",
                "url": "https://ewr1.vultrobjects.com/theliveoffice-prod/templates/images/6400833afbe4e34f1be83d25/19f7dca6-4e48-426f-8727-47562551cd8a_360p.webp",
                "mimeType": "image/webp",
                "key": "jsadhshdsakjhd",
                "size": 10916,
                "resolution": 360
              },
              {
                "id": "6400835cfbe4e34f1be83d31",
                "url": "https://ewr1.vultrobjects.com/theliveoffice-prod/templates/images/6400833afbe4e34f1be83d25/6f86343f-4f5d-468d-9b26-b7d10cf922b9_1080p.webp",
                "mimeType": "image/webp",
                "key": "jsadhshdsakjhd",
                "size": 10916,
                "resolution": 1080
              },
              {
                "id": "64008361fbe4e34f1be83d35",
                "url": "https://ewr1.vultrobjects.com/theliveoffice-prod/templates/images/6400833afbe4e34f1be83d25/fb600a28-3f28-4f07-9fd0-e97f4dfa3781_720p.webp",
                "mimeType": "image/webp",
                "key": "jsadhshdsakjhd",
                "size": 10916,
                "resolution": 720
              },
              {
                "id": "6400835cfbe4e34f1be83d2f",
                "url": "https://ewr1.vultrobjects.com/theliveoffice-prod/templates/images/6400833afbe4e34f1be83d25/fda2886b-151e-4799-8d03-78a513700d49_240p.webp",
                "mimeType": "image/webp",
                "key": "jsadhshdsakjhd",
                "size": 10916,
                "resolution": 240
              }
            ],
            "draftPreviewUrls": [],
            "type": "free",

            "customLink": "",
            "isAudioAvailable": true,
            "usersPosition": [
              {
                "bottom": 0.5,
                "left": 0.5,
              }
            ],
            "links": [],
            "isPublic": false,
            "templateType": "image",
            "draft": false,
            "author": "63fd889dfbe4e34f1be74d79"
          }
        ],
        count: 2
      }

      return {
        success: true,
        result: templateHardCode,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get common templates`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Template' })
  @ApiOkResponse({
    description: 'Create Template',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async postCreateTemplate(
    @Request() req,
  ): Promise<ResponseSumType<IUserTemplate>> {
    try {
      const templateData = await this.templatesService.createTemplate({
        userId: req.user.userId,
      });


      return {
        success: true,
        result: templateData,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while create template`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Put('/:templateId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Template' })
  @ApiOkResponse({
    description: 'Update Template',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      preservePath: true,
    }),
  )
  async editTemplate(
    @Request() req,
    @Param('templateId') templateId: string,
    @Body() templateData: Partial<IUpdateTemplate>,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseSumType<any>> {
    try {
      if (!templateId) {
        return {
          success: false,
        };
      }

      if (file) {
        const { extension } = getFileNameAndExtension(file.originalname);
        const uploadKey = `templates/videos/${templateId}/${uuidv4()}.${extension}`;

        let url = await this.uploadService.uploadFile(file.buffer, uploadKey);

        if (!/^https:\/\/*/.test(url)) {
          url = `https://${url}`;
        }

        await this.coreService.uploadTemplateFile({
          url,
          id: templateId,
          mimeType: file.mimetype,
        });
      }

      if (Object.keys(templateData).length >= 1) {
        await this.templatesService.updateTemplate({
          templateId,
          data: templateData,
        });
      }

      const template = await this.templatesService.getCommonTemplateById({
        templateId,
      });

      return {
        success: true,
        result: template,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while update template`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Get('/:templateId')
  @ApiOperation({ summary: 'Get Template' })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Get Common Template Success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getCommonTemplate(@Param('templateId') templateId: string) {
    try {
      if (!templateId) {
        return {
          success: false,
          result: null,
        };
      }

      const template = await this.templatesService.getCommonTemplateById({
        templateId,
      });

      return {
        success: true,
        result: template,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get common template`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:templateId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Template' })
  @ApiOkResponse({
    description: 'Delete Common Template Success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async deleteCommonTemplate(
    @Request() req,
    @Param('templateId') templateId: string,
  ) {
    try {
      if (templateId) {
        await this.templatesService.deleteCommonTemplate({
          templateId,
        });

        return {
          success: true,
        };
      }
      return {
        success: false,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while delete common template`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }
}
