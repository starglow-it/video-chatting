import {
  Controller,
  Get,
  Logger,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { AgoraTokenRestDTO } from '../dtos/response/agora-token.dto';

import { AgoraService } from './agora.service';

@Controller('agora')
export class AgoraController {
  private readonly logger = new Logger();
  constructor(private agoraService: AgoraService) {}

  @Get('token/:meetingId/:uid')
  @ApiOperation({ summary: 'Generate Agora Token for Meeting Meeting' })
  @ApiOkResponse({
    type: AgoraTokenRestDTO,
    description: 'Get Agora Token Success',
  })
  async generateAgoraToken(
    @Param('meetingId') meetingId: string,
    @Param('uid', ParseIntPipe) uid: number,
    @Query('isPublisher', ParseBoolPipe) isPublisher: boolean,
  ) {
    const token = await this.agoraService.generateToken(
      uid,
      meetingId,
      isPublisher,
    );

    this.logger.log(
      'Agora token has been generated',
      JSON.stringify({ meetingId }),
    );

    return {
      success: true,
      result: { token },
    };
  }
}
