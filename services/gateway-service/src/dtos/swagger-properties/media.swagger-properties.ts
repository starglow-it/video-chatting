import { SwaggerSchemaProperty } from "../../utils/types/swagger";


export const CreateUserTemplateMediaSwaggerProperty: SwaggerSchemaProperty = {
    userTemplateId: {
        type: 'string',
        format: 'string'
    },
    categoryId: {
        type: 'string',
        format: 'string'
    }
}

export const CreateMediaSwaggerProperty: SwaggerSchemaProperty = {
    categoryId: {
        type: 'string',
        format: 'string'
    }
}