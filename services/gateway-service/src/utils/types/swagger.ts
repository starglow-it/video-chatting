import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export type SwaggerSchemaProperty = Record<
  string,
  SchemaObject | ReferenceObject
>;
