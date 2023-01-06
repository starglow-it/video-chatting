import {ApiScopes, HttpMethods, QueryParams} from "shared-types";
import { urlBuilder } from "../queryBuilder";

export class ProfileApiUrlMethods {
    static scope = ApiScopes.Profile;
    static baseUrl = '';
    baseUrlInstance: URL;

    constructor() {
        this.baseUrlInstance = new URL('/', `${ProfileApiUrlMethods.baseUrl}/${ProfileApiUrlMethods.scope}`);
    }

    postProfileUrl() {
        return {
            url: this.baseUrlInstance.href,
            method: HttpMethods.Post,
        }
    }

    getProfileUrl() {
        return {
            url: this.baseUrlInstance.href,
            method: HttpMethods.Get,
        }
    }

    deleteProfileUrl() {
        return {
            url: this.baseUrlInstance.href,
            method: HttpMethods.Delete,
        }
    }

    profilePasswordUrl() {
        const url = urlBuilder(this.baseUrlInstance, '/password');

        return {
            url,
            method: HttpMethods.Post,
        }
    }

    deleteProfileAvatarUrl() {
        const url = urlBuilder(this.baseUrlInstance, '/avatar');

        return {
            url,
            method: HttpMethods.Delete,
        }
    }

    postProfileAvatarUrl() {
        const url = urlBuilder(this.baseUrlInstance, '/avatar');

        return {
            url,
            method: HttpMethods.Post,
        }
    }

    profileTemplatesUrl(params: QueryParams) {
        const url = urlBuilder(this.baseUrlInstance, '/templates', params);

        return {
            url,
            method: HttpMethods.Get,
        }
    }

    profileTemplatesCountUrl(params: QueryParams) {
        const url = urlBuilder(this.baseUrlInstance, '/templates/count', params);

        return {
            url,
            method: HttpMethods.Get,
        }
    }

    profileTemplateByTemplateIdUrl({ templateId }: { templateId: number }) {
        const url = urlBuilder(this.baseUrlInstance, `/templates/id/${templateId}`);

        return {
            url,
            method: HttpMethods.Get,
        }
    }

    getProfileTemplateUrl({ templateId }: { templateId: string }) {
        const url = urlBuilder(this.baseUrlInstance, `/templates/${templateId}`);

        return {
            url,
            method: HttpMethods.Get,
        }
    }

    postProfileTemplatesUrl({ templateId }: { templateId: string }) {
        const url = urlBuilder(this.baseUrlInstance, `/templates/${templateId}`);

        return {
            url,
            method: HttpMethods.Post,
        }
    }

    deleteProfileTemplatesUrl({ templateId }: { templateId: string }) {
        const url = urlBuilder(this.baseUrlInstance, `/templates/${templateId}`);

        return {
            url,
            method: HttpMethods.Delete,
        }
    }

    addTemplateToUserUrl({ templateId }: { templateId: string }) {
        const url = urlBuilder(this.baseUrlInstance, `/templates/add/${templateId}`);

        return {
            url,
            method: HttpMethods.Post,
        }
    }

    profileEmailUrl() {
        const url = urlBuilder(this.baseUrlInstance, `/email`);

        return {
            url,
            method: HttpMethods.Post,
        }
    }

    // TODO: refactor upload of the avatar
    uploadProfileAvatarUrl() {
        // const url = urlBuilder(this.baseUrlInstance, `/avatar`);

        return {
            url: `${ProfileApiUrlMethods.baseUrl}/upload/avatar`,
            method: HttpMethods.Post,
        }
    }

    passwordVerificationUrl() {
        const url = urlBuilder(this.baseUrlInstance, `/verify/password`);

        return {
            url,
            method: HttpMethods.Post,
        }
    }

    codeVerificationUrl() {
        const url = urlBuilder(this.baseUrlInstance, `/verify/code`);

        return {
            url,
            method: HttpMethods.Post,
        }
    }

    emailVerificationUrl() {
        const url = urlBuilder(this.baseUrlInstance, `/verify/email`);

        return {
            url,
            method: HttpMethods.Post,
        }
    }

    updateProfileTemplateUrl({ templateId }: { templateId: string }) {
        const url = urlBuilder(this.baseUrlInstance, `/templates/${templateId}`);

        return {
            url,
            method: HttpMethods.Post,
        }
    }

    updateProfileTemplateBackgroundUrl({ templateId }: { templateId: string }, params: QueryParams) {
        const url = urlBuilder(this.baseUrlInstance, `/templates/${templateId}/background`, params);

        return {
            url,
            method: HttpMethods.Post,
        }
    }
}
