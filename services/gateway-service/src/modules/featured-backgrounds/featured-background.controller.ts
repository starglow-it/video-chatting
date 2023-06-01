import { BadRequestException, Body, Controller, Delete, Get, Post, Query, Req, UploadedFile, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EntityList, IFeaturedBackground, IMedia, ResponseSumType } from 'shared-types';
import { GetMediasQueryDto } from '../../dtos/query/GetAdminMediasQuery.dto';
import { DeleteMediasRequest } from '../../dtos/requests/delete-medias.request';
import { CommonMediaRestDto } from '../../dtos/response/common-media.dto';
import { CommonResponseDto } from '../../dtos/response/common-response.dto';
import { JwtAdminAuthGuard } from '../../guards/jwt-admin.guard';
import { FeaturedBackgroundService } from './featured-background.service';
import { CommonFeatureBackgroundDto } from '../../dtos/response/common-featured-background.dto';
import { FEATURED_BACKGROUND_SCOPE } from 'shared-const';
import { ApiFile } from 'src/utils/decorators/api-file.decorator';

@ApiTags('Featured Backgrounds')
@Controller(FEATURED_BACKGROUND_SCOPE)
export class FeaturedBackgroundController {
  constructor(private readonly featuredBackgroundService: FeaturedBackgroundService) { }

  @Delete('')
  @ApiBearerAuth()
  @UseGuards(JwtAdminAuthGuard)
  @ApiOperation({ summary: 'Delete Backgrounds' })
  @ApiOkResponse({
    type: CommonResponseDto,
    description: 'Delete Backgrounds',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async deleteBackground(@Body() body: DeleteMediasRequest): Promise<ResponseSumType<void>> {
    try {

      await this.featuredBackgroundService.deleteFeaturedBackground({
        ids: body.ids
      });

      return {
        success: true
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @Get('list')
  @ApiOperation({ summary: 'Get Background list' })
  @ApiOkResponse({
    type: [CommonFeatureBackgroundDto],
    description: 'Get Background list',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getFeaturedBackgroundList(
    @Query() query: GetMediasQueryDto):
    Promise<ResponseSumType<EntityList<IFeaturedBackground>>> {
    try {
      const { skip, limit } = query;
      const medias =
        await this.featuredBackgroundService.getFeatureBackground({
          skip,
          limit
        });

      return {
        success: true,
        result: medias,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('')
  @ApiBearerAuth()
  @UseGuards(JwtAdminAuthGuard)
  @ApiOperation({ summary: 'Upload featured background' })
  @ApiOkResponse({
    type: CommonFeatureBackgroundDto,
    description: 'Upload featured background'
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  @ApiFile()
  async updateBackground(
    @Req() req,
    @UploadedFile() file: Express.Multer.File):
    Promise<ResponseSumType<IFeaturedBackground>> {
    try {
      const { userId } = req.user;
      const featuredBackgrounds = await this.featuredBackgroundService.handleUploadBackground({ file, userId });

      return {
        success: true,
        result: featuredBackgrounds
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
