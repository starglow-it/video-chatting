import {
  Controller,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { v4 as uuidv4 } from 'uuid';

import { CommonTemplateRestDTO } from '../dtos/response/common-template.dto';
import { UploadService } from './upload.service';
import { ResponseSumType } from '@shared/response/common.response';
import { getFileNameAndExtension } from '../utils/getFileNameAndExtension';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CoreService } from '../core/core.service';
import { ConfigClientService } from '../config/config.service';

@Controller('upload')
export class UploadController {
  constructor(
    private coreService: CoreService,
    private uploadService: UploadService,
    private configService: ConfigClientService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/avatar')
  @ApiOperation({ summary: 'Get Templates' })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Get Templates Success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  @UseInterceptors(FileInterceptor('profileAvatar'))
  async getUploadUrl(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseSumType<string>> {
    const { fileName, extension } = getFileNameAndExtension(file.originalname);
    const uploadId = uuidv4();

    const key = `uploads/avatar/${req.user.userId}/${uploadId}/${fileName}.${extension}`;

    await this.uploadService.uploadFile(file.buffer, key);

    const uploadBucket = await this.configService.get('uploadBucket');
    const storageHostName = await this.configService.get('storageHostname');

    const uploadUrl = `https://${storageHostName}/${uploadBucket}/${key}`;

    return {
      success: true,
      result: uploadUrl,
    };
  }
}
