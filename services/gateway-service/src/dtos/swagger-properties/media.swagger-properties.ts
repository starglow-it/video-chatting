import { MediaCategoryType } from "shared-types";
import { SwaggerSchemaProperty } from "../../utils/types/swagger";


export const CreateUserTemplateMediaSwaggerProperty: SwaggerSchemaProperty = {
    userTemplateId: {
        type: 'string',
        format: 'string'
    },
    mediaCategoryId: {
        type: 'string',
        format: 'string'
    }
}

export const CreateMediaSwaggerProperty: SwaggerSchemaProperty = {
    mediaCategoryId: {
        type: 'string',
        format: 'string'
    }
}

export const CreateMediaCategorySwaggerProperty: SwaggerSchemaProperty = {
    key: {
        type: 'string',
        format: 'string',
        pattern: '^[a-z]+$',
        description: `
        The value must follow the following conventions:
        1 - No capital letters.
        2 - No special characters.
        3 - No spaces.
        4 - Min lenght 3.
        5 - Max length 10.
        `,
        example: 'onichan',
        minLength: 3,
        maxLength: 10
    },
    value: {
        type: 'string',
        format: 'string',
        example: 'Oni Chan'
    },

    type: {
        type: 'string',
        format: 'string',
        enum: Object.values(MediaCategoryType)
    }
}

export const UpdateMediaCategorySwaggerProperty = CreateMediaCategorySwaggerProperty;