import { attach, combine } from 'effector-next';

import { meetingDomain } from '../domain';

import { ErrorState, MeetingUser, Profile, UpdateTemplateData, UserTemplate } from '../../types';

import { $profileStore } from '../../profile/profile/model';
import { $meetingUsersStore } from '../../users/meetingUsers/model';

export const initialTemplateState: UserTemplate = {
    id: '',
    templateId: 0,
    url: '',
    name: '',
    maxParticipants: 0,
    businessCategories: [],
    description: '',
    previewUrls: [],
    type: '',
    companyName: '',
    contactEmail: '',
    fullName: '',
    position: '',
    languages: [],
    socials: [],
    usedAt: '',
    customLink: '',
    templatePrice: 10,
    templateCurrency: 'USD',
    signBoard: 'default',
    isMonetizationEnabled: false,
    usersPosition: [],
};

export const $meetingTemplateStore = meetingDomain.store<UserTemplate>(initialTemplateState);

export const $isUserSendEnterRequest = meetingDomain.store<boolean>(false);
export const $isMeetingInstanceExists = $meetingTemplateStore.map(
    state => state?.meetingInstance?.id,
);

export const $isOwner = combine<{ meetingTemplate: UserTemplate; profile: Profile }>({
    meetingTemplate: $meetingTemplateStore,
    profile: $profileStore,
}).map(
    ({ meetingTemplate, profile }) =>
        Boolean(profile.id) && meetingTemplate?.meetingInstance?.owner === profile.id,
);

export const $isOwnerInMeeting = combine<{ template: UserTemplate; users: MeetingUser[] }>({
    users: $meetingUsersStore,
    template: $meetingTemplateStore,
}).map(({ users, template }) =>
    Boolean(users.find(user => user.profileId === template?.meetingInstance?.owner)),
);

export const setIsUserSendEnterRequest = meetingDomain.event<boolean>('setIsUserSendEnterRequest');

export const getMeetingTemplateFx = meetingDomain.effect<
    { templateId: UserTemplate['id'] },
    UserTemplate,
    ErrorState
>('getMeetingTemplateFx');

export const updateMeetingTemplateFx = meetingDomain.effect<
    UpdateTemplateData,
    UserTemplate,
    ErrorState
>('updateMeetingTemplateFx');

export const checkCustomLinkFx = meetingDomain.effect<
    { templateId: UserTemplate['customLink'] },
    boolean,
    ErrorState
>('checkCustomLinkFx');

export const updateMeetingTemplateFxWithData = attach({
    mapParams: (params, states) => ({
        templateId: states.meetingTemplate.id,
        userId: states.profile.id,
        data: params,
    }),
    effect: updateMeetingTemplateFx,
    source: combine({ meetingTemplate: $meetingTemplateStore, profile: $profileStore }),
});

export const checkCustomLinkFxWithData = attach({
    mapParams: params => ({
        templateId: params?.templateId,
    }),
    effect: checkCustomLinkFx,
});
