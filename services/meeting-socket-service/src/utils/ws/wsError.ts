import { Socket } from 'socket.io';
import { WsBadRequestException } from '../../exceptions/ws.exception';

export type WsError = {
  success: false;
  message?: string;
};

export function wsError(client: Socket, err: unknown): WsError {
  const error = err['message'] as string | object;
  const details =
    error instanceof Object
      ? { ...error }
      : error.trim().split('.').length - 1
      ? { i18nMsg: error }
      : { message: error };

  console.error({
    clientId: client.id,
    error: details,
  });
  console.error(err['stack']);

  return {
    success: false,
    ...(details.i18nMsg && {
      message: details.i18nMsg,
    }),
  };
}

export const throwWsError = (condition: boolean, message: string) => {
  if (condition) {
    throw new WsBadRequestException(message);
  }
};

export const subscribeWsError = (socket: Socket) =>
  throwWsError(socket.data.error, socket.data.error);
