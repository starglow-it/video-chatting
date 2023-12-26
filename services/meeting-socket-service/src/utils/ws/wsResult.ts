import { ResponseSumType } from 'shared-types';

export const wsResult = (data?: unknown) =>
  ({
    success: true,
    ...(data && { result: data }),
  } as ResponseSumType<any>);
