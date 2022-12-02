import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { UserTemplatesService } from './user-templates.service';

// dtos
import { CommonTemplateRestDTO } from '../../dtos/response/common-template.dto';

// guards
import { JwtAuthGuard } from '../../guards/jwt.guard';

@Controller('user-templates')
export class UserTemplatesController {
  private readonly logger = new Logger();
  constructor(private userTemplatesService: UserTemplatesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Users Templates except target user' })
  @ApiOkResponse({
    description: 'Fetch users templates succeeded',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getUsersTemplates(
    @Request() req,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('sort') sort: string,
    @Query('dir') direction: number,
  ) {
    try {
      const templatesData = await this.userTemplatesService.getUsersTemplates({
        userId: req.user.userId,
        skip,
        limit,
        sort,
        direction,
      });

      return {
        success: true,
        result: templatesData,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get users templates`,
        },
        JSON.stringify(err),
      );
      throw new BadRequestException(err);
    }
  }

  @Get('/:templateId')
  @ApiOperation({ summary: 'Get User Template' })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Get User Template Success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getUserTemplateById(@Param('templateId') templateId: string) {
    try {
      if (templateId) {
        const template = await this.userTemplatesService.getUserTemplateById({
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
          message: `An error occurs, while get user template by id`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }
}
