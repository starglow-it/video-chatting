import { combine } from 'effector';
import { IUserTemplate, MeetingRole } from 'shared-types';
import { Profile } from 'src/store/types';
import { $profileStore } from 'src/store/profile/profile/model';
import { meetingDomain } from 'src/store/domains';
import { $meetingTemplateStore } from '../meetingTemplate/model';

export const $roleQueryUrlStore = meetingDomain.createStore<null | string>(
    null,
);

export const setRoleQueryUrlEvent = meetingDomain.createEvent<string | null>(
    'setRoleQueryUrlEvent',
);

export const $meetingRoleStore = combine<{
    meetingTemplate: IUserTemplate;
    profile: Profile;
    roleQueryUrl: null | string;
}>({
    meetingTemplate: $meetingTemplateStore,
    profile: $profileStore,
    roleQueryUrl: $roleQueryUrlStore,
}).map(({ meetingTemplate, profile, roleQueryUrl }) =>
    Boolean(profile.id) &&
    meetingTemplate?.meetingInstance?.owner === profile.id
        ? MeetingRole.Host
        : roleQueryUrl === MeetingRole.Audience
        ? MeetingRole.Audience
        : MeetingRole.Participant,
);

export const $isOwner = combine({
    role: $meetingRoleStore,
}).map(({ role }) => role === MeetingRole.Host);

export const $isParticipant = combine({
    role: $meetingRoleStore,
}).map(({ role }) => role === MeetingRole.Participant);

export const $isAudience = combine({
    role: $meetingRoleStore,
}).map(({ role }) => role === MeetingRole.Audience);
