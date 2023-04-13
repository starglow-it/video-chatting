import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Logger,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Request,
    UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { EntityList, ResponseSumType, IMedia, IMediaCategory, IUserTemplateMedia } from 'shared-types';
import { CreateUserTemplateMediaRequest } from '../../dtos/requests/create-user-template-media.request';
import { MediaCategoryRestDTO } from '../../dtos/response/common-media-category.dto';
import { getFileNameAndExtension } from '../../utils/getFileNameAndExtension';
import { MediasService } from './medias.service';
import { v4 as uuidv4 } from 'uuid';
import { UploadService } from '../upload/upload.service';
import { ApiFile } from '../../utils/decorators/api-file.decorator';
import { UserTemplateMediaRestDto } from '../../dtos/response/common-user-template-media.dto';
import { GetUserTemplateMediasQueryDto } from 'src/dtos/query/GetUserTemplateMedias.dto';

@ApiTags('Medias')
@Controller('medias')
export class MediasController {
    private readonly logger = new Logger();

    constructor(
        private mediaService: MediasService,
        private uploadService: UploadService,
    ) { }

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
    @ApiOperation({ summary: 'Get User Template Medias By Category Id' })
    @ApiOkResponse({
        type: [UserTemplateMediaRestDto],
        description: 'Get User Template Medias',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    async getUserTemplateMedias(
        @Param('categoryId') categoryId: string,
        @Query() query: GetUserTemplateMediasQueryDto
    ): Promise<ResponseSumType<EntityList<IMedia>>> {
        try {
            const {skip, limit, userTemplateId} = query;
            
            const medias =
                await this.mediaService.getUserTemplateMedias({
                    skip,
                    limit,
                    mediaCategoryId: categoryId,
                    userTemplateId
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

    @Post('/user-template')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create User Template Media' })
    @ApiOkResponse({
        type: UserTemplateMediaRestDto,
        description: 'Create User Template Media',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    @ApiFile({
        userTemplateId: {
            type: 'string',
            format: 'string'
        },
        mediaCategoryId: {
            type: 'string',
            format: 'string'
        }
    })
    async createUserTemplateMedia(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: CreateUserTemplateMediaRequest
    ): Promise<ResponseSumType<IUserTemplateMedia>>{
        try {
            let userTemplateMedia;
            userTemplateMedia = await this.mediaService.createUserTemplateMedia(body);

            if (file) {
                const { extension } = getFileNameAndExtension(file.originalname);
                const uploadKey = `templates/videos/${userTemplateMedia.id}/${uuidv4()}.${extension}`;
                
                let url = await this.uploadService.uploadFile(file.buffer, uploadKey);


                if (!/^https:\/\/*/.test(url)) {
                    url = `https://${url}`;
                }

                userTemplateMedia = await this.mediaService.uploadUserTemplateMediaFile({
                    url,
                    id: userTemplateMedia.id,
                    mimeType: file.mimetype,
                });
            }

            return {
                success: true,
                result: userTemplateMedia
            };
        }
        catch (err) {
            throw new BadRequestException(err);
        }
    }
}
