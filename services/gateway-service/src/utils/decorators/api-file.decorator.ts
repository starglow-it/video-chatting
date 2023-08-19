import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { SwaggerSchemaProperty } from '../types/swagger';

type Options = {
  isOptionalAllProperties: boolean;
};

type MultiDecorators = <TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void;

export const ApiFile = (
  properties?: SwaggerSchemaProperty,
  options?: Options,
): MultiDecorators =>
  applyDecorators(
    UseInterceptors(
      FileInterceptor('file', {
        preservePath: true,
      }),
    ),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        ...(!options?.isOptionalAllProperties && {
          required: [...Object.keys(properties || {}), 'file'],
        }),
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
          ...properties,
        },
      },
    }),
  );
