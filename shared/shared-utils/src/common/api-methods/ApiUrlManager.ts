import {ApiScopes} from "shared-types";
import {AuthApiUrlMethods, MeetingsApiUrlMethods, ProfileApiUrlMethods, TemplatesApiUrlMethods} from "./apiUrlMethods";

export type ApiUrls = {
    [ApiScopes.Auth]:  typeof AuthApiUrlMethods;
    [ApiScopes.Meetings]:  typeof MeetingsApiUrlMethods;
    [ApiScopes.Profile]:  typeof ProfileApiUrlMethods;
    [ApiScopes.Templates]:  typeof TemplatesApiUrlMethods;
};

const apiUrlMethodsRegistry: ApiUrls = {
    [ApiScopes.Auth]: AuthApiUrlMethods,
    [ApiScopes.Meetings]: MeetingsApiUrlMethods,
    [ApiScopes.Profile]: ProfileApiUrlMethods,
    [ApiScopes.Templates]: TemplatesApiUrlMethods,
}

class ApiUrlManager {
    baseUrl: string;

    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    getApiScopeUrlsMethods = <K extends keyof ApiUrls>(scope: K): ApiUrls[K] => {
        const TargetClass = apiUrlMethodsRegistry[scope];

        TargetClass.baseUrl = this.baseUrl;

        return TargetClass;
    }
}

export { ApiUrlManager };