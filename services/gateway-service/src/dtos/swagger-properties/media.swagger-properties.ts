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