import { ClassConstructor, plainToInstance } from 'class-transformer';
export const serializeInstance = <T, V>(
  from: V,
  to: ClassConstructor<T>,
): V extends Array<object> ? T[] : T => {
  return plainToInstance(to, from, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  }) as any;
};
