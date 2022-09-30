import { Inject, Injectable } from '@nestjs/common';
import { MEDIA_SERVER_PROVIDER } from '@shared/providers';
import { ClientProxy } from '@nestjs/microservices';
import { MeetingBrokerPatterns } from '@shared/patterns/meetings';
import { GetMediaServerTokenPayload } from '@shared/broker-payloads/meetings';

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
