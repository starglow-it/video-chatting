import { UserRoles } from "shared-types";
import { SwaggerSchemaProperty } from "../../utils/types/swagger";

export const CreateMeetingAvatarSwaggerProperty: SwaggerSchemaProperty = {
    roles: {
      type: 'array',
      description: 'Roles must be user roles',
      items: {
        type: 'string',
        format: 'array',
        example: '232323',
        
      },
    },
  };