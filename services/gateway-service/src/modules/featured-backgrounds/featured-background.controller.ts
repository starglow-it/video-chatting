import { BadRequestException, Body, Controller, Delete, Get, Post, Query, Req, UploadedFile, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FEATURED_BACKGROUND_SCOPE } from 'shared-const';
import { EntityList, IFeatureBackground, IMedia, ResponseSumType } from 'shared-types';
import { GetMediasQueryDto } from '../../dtos/query/GetAdminMediasQuery.dto';
import { DeleteMediasRequest } from '../../dtos/requests/delete-medias.request';
import { CommonFeatureBackgroundDto } from '../../dtos/response/common-featured-background.dto';
import { CommonMediaRestDto } from '../../dtos/response/common-media.dto';
import { CommonResponseDto } from '../../dtos/response/common-response.dto';
import { JwtAdminAuthGuard } from '../../guards/jwt-admin.guard';
import { FeaturedBackgroundService } from './featured-background.service';

@ApiTags('featured-backgrounds')
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
    Promise<ResponseSumType<EntityList<IFeatureBackground>>> {
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
  @ApiOperation({ summary: 'Upload featured background' })
  @ApiOkResponse({
    type: CommonMediaRestDto,
    description: 'Upload featured background'
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async updateBackground(@Req() req, @UploadedFile() file: Express.Multer.File): Promise<ResponseSumType<IMedia>> {
    try {
      const { userId } = req.user
      const media = await this.featuredBackgroundService.handleUploadBackground({ file, userId});

      return {
        success: true,
        result: media
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
