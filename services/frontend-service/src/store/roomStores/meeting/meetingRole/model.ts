import { combine } from 'effector';
import { IUserTemplate } from 'shared-types';
import { Profile } from 'src/store/types';
import { $profileStore } from 'src/store/profile/profile/model';
import { meetingDomain } from 'src/store/domains';
import { $meetingTemplateStore } from '../meetingTemplate/model';

export const $roleQueryUrlStore = meetingDomain.createStore<null | string>(
    null,
);

export const setRoleQueryUrlEvent = meetingDomain.createEvent<string>(
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
        ? 'owner'
        : roleQueryUrl === 'luker'
        ? 'luker'
        : 'participant',
);

export const $isOwner = combine({
    role: $meetingRoleStore,
}).map(({ role }) => role === 'owner');

export const $isParticipant = combine({
    role: $meetingRoleStore,
}).map(({ role }) => role === 'participant');

export const $isLuker = combine({
    role: $meetingRoleStore,
}).map(({ role }) => role === 'luker');
