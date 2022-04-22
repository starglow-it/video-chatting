import {meetingScope, serverUrl, usersScope} from "./baseData";
import {HttpMethods} from "../../store/types";

export const CREATE_MEETING_URL = `${meetingScope}`;
export const GET_MEETING_URL = `${meetingScope}`;

export const getMeetingUrl = (templateId: string) => ({
    url: `${serverUrl}/${GET_MEETING_URL}/${templateId}`,
    method: HttpMethods.Get
});

export const getUserTemplatesUrl = ({ templateId }: { templateId: string; }) => ({
    url: `${serverUrl}/${usersScope}/templates/${templateId ? templateId : ''}`,
    method: HttpMethods.Get,
});

export const postUserTemplatesUrl = ({ templateId }: { templateId: string; }) => ({
    url: `${serverUrl}/${usersScope}/templates/${templateId ? templateId : ''}`,
    method: HttpMethods.Post,
});

export const createMeetingUrl = {
    url: `${serverUrl}/${CREATE_MEETING_URL}`,
    method: HttpMethods.Post,
};

export const deleteMeetingUrl = {
    url: `${serverUrl}/${CREATE_MEETING_URL}`,
    method: HttpMethods.Delete,
};
