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
    ApiTags,
} from '@nestjs/swagger';
import { EntityList, ResponseSumType, IMedia, IMediaCategory } from 'shared-types';
import { MediaCategoryRestDTO } from 'src/dtos/response/common-media-category.dto';
import { MediaRestDTO } from 'src/dtos/response/common-media.dto';
import { MediasService } from './medias.service';

@ApiTags('Medias')
@Controller('medias')
export class MediasController {
    private readonly logger = new Logger();

    constructor(private mediaService: MediasService) { }

    @Get('/categories')
    @ApiOperation({ summary: 'Get Categories' })
    @ApiOkResponse({
        type: MediaCategoryRestDTO,
        description: 'Get Categories Success',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    async getCategories(
        @Request() req,
        @Query('skip', ParseIntPipe) skip: number,
        @Query('limit', ParseIntPipe) limit: number,
    ): Promise<ResponseSumType<EntityList<IMediaCategory>>> {
        try {
            const mediaCategories =
                await this.mediaService.getMediaCategories({
                    skip,
                    limit,
                });

            return {
                success: true,
                result: mediaCategories,
            };
        } catch (err) {
            this.logger.error(
                {
                    message: `An error occurs, while get media categories`,
                },
                JSON.stringify(err),
            );
            throw new BadRequestException(err);
        }
    }


    @Get('/:categoryId')
    @ApiOperation({ summary: 'Get Medias By Category Id' })
    @ApiOkResponse({
        type: [MediaRestDTO],
        description: 'Get Medias',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    async getMeidas(
        @Param('categoryId') categoryId: string,
        @Query('skip', ParseIntPipe) skip: number,
        @Query('limit', ParseIntPipe) limit: number,
    ): Promise<ResponseSumType<EntityList<IMedia>>> {
        try {
            const medias =
                await this.mediaService.getMedias({
                    skip,
                    limit,
                    mediaCategoryId: categoryId
                });

            return {
                success: true,
                result: medias,
            };
        } catch (err) {
            this.logger.error(
                {
                    message: `An error occurs, while get medias`,
                },
                JSON.stringify(err),
            );
            throw new BadRequestException(err);
        }
    }
}
