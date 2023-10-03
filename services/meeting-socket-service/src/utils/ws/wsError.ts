import { Socket } from 'socket.io';

export const wsError = (client: Socket, error: unknown) => {
  console.error({
    ctx: client ? client.id : 'unknow',
    error,
  });

  return {
    success: false
  };
};
