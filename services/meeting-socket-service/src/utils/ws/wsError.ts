type WsError = {
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
    ctx: clientId ? clientId : 'unknow',
    error: error ?? message,
  });

  return {
    success: false,
    ...(message && {
      message,
    }),
  };
}
