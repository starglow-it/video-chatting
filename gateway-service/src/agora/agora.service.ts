import { Injectable } from '@nestjs/common';
import { RtcRole, RtcTokenBuilder } from 'agora-access-token';
import { ConfigClientService } from '../config/config.service';

@Injectable()
export class AgoraService {
  constructor(private configService: ConfigClientService) {}

  async generateToken(uid: number, meetingId: string, isPublisher: boolean) {
    const appID = await this.configService.get('appId');
    const appCertificate = await this.configService.get('appCertificate');

    const privilegeExpiredTs = Math.round((Date.now() + 3600 * 1000) / 1000);

    return RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      meetingId,
      uid,
      isPublisher ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER,
      privilegeExpiredTs,
    );
  }
}
