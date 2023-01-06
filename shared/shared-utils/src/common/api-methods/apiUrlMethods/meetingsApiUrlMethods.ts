import {ApiScopes, HttpMethods} from "shared-types";

export class MeetingsApiUrlMethods {
    static scope = ApiScopes.Meetings;
    static baseUrl = '';

    constructor() {}

    getMeetingUrl(templateId) {
        return {
            url: `${MeetingsApiUrlMethods.baseUrl}/${MeetingsApiUrlMethods.scope}/${templateId}`,
            method: HttpMethods.Get,
        }
    }

    getMeetingTemplateUrl({ templateId }: { templateId: string }) {
        return {
            url: `${MeetingsApiUrlMethods.baseUrl}/${MeetingsApiUrlMethods.scope}/templates/${templateId}`,
            method: HttpMethods.Get,
        }
    }

    createMeetingUrl() {
        return {
            url: `${MeetingsApiUrlMethods.baseUrl}/${MeetingsApiUrlMethods.scope}`,
            method: HttpMethods.Post,
        }
    }

    deleteMeetingUrl() {
        return {
            url: `${MeetingsApiUrlMethods.baseUrl}/${MeetingsApiUrlMethods.scope}`,
            method: HttpMethods.Delete,
        }
    }

    getSFUTokenUrl() {
        return {
            url: `${MeetingsApiUrlMethods.baseUrl}/${MeetingsApiUrlMethods.scope}/token`,
            method: HttpMethods.Post,
        }
    }
}