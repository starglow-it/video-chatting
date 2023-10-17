import { RpcException } from '@nestjs/microservices';

export const throwRpcError = (condition: boolean, message: string) => {
  if (condition) {
    throw new RpcException({
      message,
    });
  }
};
