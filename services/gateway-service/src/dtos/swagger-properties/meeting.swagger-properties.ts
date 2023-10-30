import { SwaggerSchemaProperty } from '../../utils/types/swagger';

export const CreateMeetingAvatarSwaggerProperty: SwaggerSchemaProperty = {
  roles: {
    type: 'array',
    format: 'string',
    description: 'Roles must be user roles',
    items: {
      type: 'string',
      format: 'string',
    },
  },
};
