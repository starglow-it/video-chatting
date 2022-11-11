import { attach, combine, Store } from 'effector-next';
import { ErrorState } from 'shared-types';
import { meetingDomain } from '../../../domains';

import { $profileStore } from '../../../profile/profile/model';
import { $meetingUsersStore } from '../../users/meetingUsers/model';

import { MeetingUser, Profile, UserTemplate } from '../../../types';
import { UpdateTemplatePayload } from '../../../profile/types';

export const initialTemplateState: UserTemplate = {
    id: '',
    templateId: 0,
    url: '',
    name: '',
    maxParticipants: 0,
    businessCategories: [],
    description: '',
    shortDescription: '',
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
    priceInCents: 0,
    templateCurrency: 'USD',
    signBoard: 'default',
    isMonetizationEnabled: false,
    isAudioAvailable: false,
    usersPosition: [],
    meetingInstance: {
        id: '',
        serverIp: '',
        owner: '',
        serverStatus: '',
    },
};

export const $meetingTemplateStore = meetingDomain.createStore<UserTemplate>(initialTemplateState);

export const $isUserSendEnterRequest = meetingDomain.createStore<boolean>(false);
export const $isMeetingInstanceExists = $meetingTemplateStore.map(state =>
    Boolean(state?.meetingInstance?.id),
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

export const setIsUserSendEnterRequest = meetingDomain.createEvent<boolean>(
    'setIsUserSendEnterRequest',
);

export const resetMeetingTemplateStoreEvent = meetingDomain.createEvent(
    'resetMeetingTemplateStoreEvent',
);

export const getMeetingTemplateFx = meetingDomain.createEffect<
    { templateId: UserTemplate['id'] },
    UserTemplate,
    ErrorState
>('getMeetingTemplateFx');

export const updateMeetingTemplateFx = meetingDomain.createEffect<
    UpdateTemplatePayload,
    UserTemplate,
    ErrorState
>('updateMeetingTemplateFx');

export const updateMeetingTemplateFxWithData = attach<
    Partial<UserTemplate>,
    Store<{
        meetingTemplate: UserTemplate;
        profile: Profile;
    }>,
    typeof updateMeetingTemplateFx
>({
    mapParams: (params, states) => ({
        templateId: states.meetingTemplate.id,
        userId: states.profile.id,
        data: params,
    }),
    effect: updateMeetingTemplateFx,
    source: combine<{ meetingTemplate: UserTemplate; profile: Profile }>({
        meetingTemplate: $meetingTemplateStore,
        profile: $profileStore,
    }),
});
