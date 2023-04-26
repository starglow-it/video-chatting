import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ReferenceObject, SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const ApiFile = (properties?: Record<string, SchemaObject | ReferenceObject>) => {
  return applyDecorators(
    UseInterceptors(FileInterceptor('file',{
        preservePath: true,
    })),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: [...Object.keys(properties || {}), 'file'],
        properties: {
          file: {
            type: 'string',
            format: 'binary'
          },
          ...properties
        },
      }
    }),
  );
}