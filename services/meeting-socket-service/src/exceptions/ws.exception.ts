import { WsException } from '@nestjs/websockets';

export class WsBadRequestException extends WsException {
  constructor(error: string | object) {
    super(error);
  }
}
