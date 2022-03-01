import getConfig from 'next/config';
import isServer from '../../helpers/isServer';

const authScope = 'auth';
const meetingScope = 'meetings';
const usersScope = 'users';
const templatesScope = 'templates';
const uploadScope = 'upload';

const { publicRuntimeConfig } = getConfig();

export const serverUrl = isServer()
    ? `http://${publicRuntimeConfig.gatewayHost}:${publicRuntimeConfig.gatewayPort}/api`
    : '/api';

export const REFRESH_URL = `${authScope}/refresh`;
export const REGISTER_USER_URL = `${authScope}/register`;
export const CONFIRM_REGISTER_USER_URL = `${authScope}/confirm-registration`;
export const LOGIN_USER_URL = `${authScope}/login`;
export const ME_URL = `${authScope}/me`;
export const LOGOUT_URL = `${authScope}/logout`;
export const CREATE_MEETING_URL = `${meetingScope}/create`;
export const GET_MEETING_URL = `${meetingScope}`;
export const SEND_INVITE_EMAIL = `${usersScope}/invite/email`;
export const PROFILE_URL = `${usersScope}/profile`;
export const TEMPLATES_URL = `${templatesScope}`;

export const refreshUrl = `${serverUrl}/${REFRESH_URL}`;
export const registerUserUrl = `${serverUrl}/${REGISTER_USER_URL}`;
export const confirmRegisterUserUrl = `${serverUrl}/${CONFIRM_REGISTER_USER_URL}`;
export const loginUserUrl = `${serverUrl}/${LOGIN_USER_URL}`;
export const meUrl = `${serverUrl}/${ME_URL}`;
export const profileUrl = `${serverUrl}/${PROFILE_URL}`;
export const profileAvatarUrl = `${serverUrl}/${PROFILE_URL}/avatar`;
export const profileEmailUrl = `${serverUrl}/${PROFILE_URL}/email`;
export const profilePasswordUrl = `${serverUrl}/${PROFILE_URL}/password`;

export const templatesUrl = `${serverUrl}/${TEMPLATES_URL}`;
export const getCommonTemplateUrl = ({ templateId }: { templateId: string }) =>
    `${templatesUrl}/${templateId}`;

export const profileTemplatesUrl = ({ userId }: { userId: string }) =>
    `${serverUrl}/${usersScope}/${userId}/${TEMPLATES_URL}`;

export const getUserTemplateUrl = ({
    templateId,
    userId,
}: {
    templateId: string;
    userId: string;
}) => `${profileTemplatesUrl({ userId })}/${templateId}`;
export const updateUserTemplateUrl = ({
    templateId,
    userId,
}: {
    templateId: string;
    userId: string;
}) => `${profileTemplatesUrl({ userId })}/${templateId}`;

export const logoutProfileUrl = `${serverUrl}/${LOGOUT_URL}`;
export const createMeetingUrl = `${serverUrl}/${CREATE_MEETING_URL}`;
export const getMeetingUrl = (meetingId: string) => `${serverUrl}/${GET_MEETING_URL}/${meetingId}`;
export const generateAgoraTokenUrl = (meetingId: string, uid: number, isPublisher: boolean) =>
    `${serverUrl}/agora/token/${meetingId}/${uid}?isPublisher=${isPublisher}`;
export const sendInviteEmailUrl = `${serverUrl}/${SEND_INVITE_EMAIL}`;

export const uploadProfileAvatarUrl = `${serverUrl}/${uploadScope}/avatar`;

export const passwordVerificationUrl = `${profileUrl}/verify/password`;
export const codeVerificationUrl = `${profileUrl}/verify/code`;
export const emailVerificationUrl = `${profileUrl}/verify/email`;
