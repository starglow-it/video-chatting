import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CommonTemplateRestDTO } from '../dtos/response/common-template.dto';
import { ResponseSumType } from '@shared/response/common.response';
import { ICommonTemplate } from '@shared/interfaces/common-template.interface';
import { EntityList } from '@shared/types/utils/http/list.type';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class TemplatesController {
  private readonly logger = new Logger();
  constructor(private templatesService: TemplatesService) {}

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
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<ResponseSumType<EntityList<ICommonTemplate>>> {
    try {
      const templatesData = await this.templatesService.getCommonTemplates({
        skip,
        limit,
      });

      return {
        success: true,
        result: templatesData,
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

  @Get('/:templateId')
  @ApiOperation({ summary: 'Get Templates' })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Get Common Template Success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getCommonTemplate(@Param('templateId') templateId: string) {
    try {
      if (templateId) {
        const template = await this.templatesService.getCommonTemplate({
          id: templateId,
        });

        return {
          success: true,
          result: template,
        };
      }
      return {
        success: false,
        result: null,
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
}
