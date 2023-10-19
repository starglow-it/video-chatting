import { WsBadRequestException } from 'src/exceptions/ws.exception';

export type WsError = {
  success: false;
  message?: string;
};

export function wsError(clientId: string, message: string): WsError;
export function wsError(clientId: string, error: unknown): WsError;
export function wsError(
  clientId: string,
  error?: unknown,
  message?: string,
): WsError {
  console.error({
    ctx: clientId ?? 'unknow',
    error: error ?? message,
  });

  return {
    success: false,
    ...(message && {
      message,
    }),
  };
}

export const throwWsError = (condition: boolean, message: string) => {
  if (condition) {
    throw new WsBadRequestException(message);
  }
};
