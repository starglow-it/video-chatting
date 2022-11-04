import { Controller } from '@nestjs/common';
import { SOCKET_SCOPE } from 'shared-const';

@Controller(SOCKET_SCOPE)
export class SocketController {}
