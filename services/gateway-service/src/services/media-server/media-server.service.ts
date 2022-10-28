import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MEDIA_SERVER_PROVIDER, MeetingBrokerPatterns, GetMediaServerTokenPayload } from 'shared';

@Injectable()
export class MediaServerService {
  constructor(@Inject(MEDIA_SERVER_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async getMediaServerToken(payload: GetMediaServerTokenPayload): Promise<{
    result: string;
  }> {
    return this.client
        .send(MeetingBrokerPatterns.GetMediaServerToken, payload)
        .toPromise();
  }
}
