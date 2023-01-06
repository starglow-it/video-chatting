import {ApiScopes, HttpMethods, QueryParams} from "shared-types";
import { urlBuilder } from "../queryBuilder";

export class TemplatesApiUrlMethods {
    static scope = ApiScopes.Templates;
    static baseUrl = '';
    baseUrlInstance: URL;

    constructor() {
        this.baseUrlInstance = new URL('/', `${TemplatesApiUrlMethods.baseUrl}/${TemplatesApiUrlMethods.scope}`);
    }

    getCommonTemplateUrl({ templateId }: { templateId: string }) {
        const url = urlBuilder(this.baseUrlInstance, `/${templateId}`);

        return {
            url: url,
            method: HttpMethods.Get,
        }
    }

    getTemplatesUrl(params: QueryParams) {
        const url = urlBuilder(this.baseUrlInstance, `/`, params);

        return {
            url: url,
            method: HttpMethods.Get,
        }
    }

    createTemplateUrl() {
        const url = urlBuilder(this.baseUrlInstance, `/`);

        return {
            url: url,
            method: HttpMethods.Post,
        }
    }

    updateTemplateUrl({ templateId }: { templateId: string }) {
        const url = urlBuilder(this.baseUrlInstance, `/${templateId}`);

        return {
            url: url,
            method: HttpMethods.Put,
        }
    }

    deleteTemplateUrl({ templateId }: { templateId: string }) {
        const url = urlBuilder(this.baseUrlInstance, `/${templateId}`);

        return {
            url: url,
            method: HttpMethods.Delete,
        }
    }

    uploadCommonTemplateBackgroundUrl({ templateId }: { templateId: string }, params: QueryParams) {
        const url = urlBuilder(this.baseUrlInstance, `/${templateId}/background`, params);

        return {
            url: url,
            method: HttpMethods.Post,
        }
    }
}


// export const usersTemplatesUrl = ({ skip = 0, limit = 0 }) => ({
//     url: `${serverUrl}/user-templates?skip=${skip}&limit=${limit}`,
//     method: HttpMethods.Get,
// });

// export const getUserTemplateUrl = ({ templateId }: { templateId: string }) => ({
//     url: `${serverUrl}/user-templates/${templateId}`,
//     method: HttpMethods.Get,
// });

//
// export const userTemplateUrl = ({ templateId }: { templateId: ICommonTemplate['id'] }) => ({
//     url: `${userTemplatesUrl}/templates/${templateId}`,
//     method: HttpMethods.Get,
// });
//



