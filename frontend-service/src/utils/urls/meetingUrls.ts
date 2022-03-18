import {meetingScope, serverUrl, usersScope} from "./baseData";
import {HttpMethods} from "../../store/types";

export const CREATE_MEETING_URL = `${meetingScope}/create`;
export const GET_MEETING_URL = `${meetingScope}`;

export const getMeetingUrl = (meetingId: string) => ({
    url: `${serverUrl}/${GET_MEETING_URL}/${meetingId}`,
    method: HttpMethods.Get
});

export const userTemplatesUrl = ({ templateId }: { templateId: string; }) => ({
    url: `${serverUrl}/${usersScope}/templates/${templateId ? templateId : ''}`,
    method: HttpMethods.Post,
});

export const createMeetingUrl = {
    url: `${serverUrl}/${CREATE_MEETING_URL}`,
    method: HttpMethods.Post,
};
