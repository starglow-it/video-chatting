import { meetingScope, serverUrl } from './baseData';
import { HttpMethods } from '../../store/types';

export const CREATE_MEETING_URL = `${meetingScope}`;
export const GET_MEETING_URL = `${meetingScope}`;

export const getMeetingUrl = (templateId: string) => ({
    url: `${serverUrl}/${GET_MEETING_URL}/${templateId}`,
    method: HttpMethods.Get,
});

export const getMeetingTemplateUrl = ({
    templateId,
}: {
    templateId: string;
}) => ({
    url: `${serverUrl}/meetings/templates/${templateId}`,
    method: HttpMethods.Get,
});

export const createMeetingUrl = {
    url: `${serverUrl}/${CREATE_MEETING_URL}`,
    method: HttpMethods.Post,
};

export const deleteMeetingUrl = {
    url: `${serverUrl}/${CREATE_MEETING_URL}`,
    method: HttpMethods.Delete,
};

export const getSFUTokenUrl = {
    url: `${serverUrl}/${meetingScope}/token`,
    method: HttpMethods.Post,
};
