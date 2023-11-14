import { Socket } from 'socket.io';
import { WsBadRequestException } from '../../exceptions/ws.exception';

export type WsError = {
  success: false;
  message?: string;
};

export function wsError(client: Socket, err: unknown) {
  const error = err['message'] as string | object
  const details =
    error instanceof Object
      ? { ...error }
      : error.trim().split('.').length - 1
      ? { i18nMsg: error }
      : { message: error };

  console.error({
    clientId: client.id,
    error: details,
    exception: error['stack'],
  });

  client.send({
    success: false,
    ...(details.i18nMsg && {
      message: details.i18nMsg,
    }),
  });
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
