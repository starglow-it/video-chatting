import { SetMetadata, applyDecorators } from '@nestjs/common';
import { TMultiDecorators } from '../types/multipleDecorator';
import { SubscribeMessage } from '@nestjs/websockets';

export const WS_EVENT = 'ws_event';

const EventNameMetadata = (evName: string) => SetMetadata(WS_EVENT, evName);

export const WsEvent = (evName: string): TMultiDecorators =>
  applyDecorators(SubscribeMessage(evName), EventNameMetadata(evName));
