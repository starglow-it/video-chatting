import { Socket } from 'socket.io';

export const wsError = (clientId: string, error: unknown) => {
  console.error({
    ctx: clientId ? clientId : 'unknow',
    error,
  });

  return {
    success: false
  };
};
