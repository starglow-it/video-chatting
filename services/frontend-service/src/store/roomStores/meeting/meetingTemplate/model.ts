import { attach, combine, Store } from 'effector-next';
import {
    ErrorState,
    FailedResult,
    IUserTemplate,
    MeetingAccessStatusEnum,
    SuccessResult,
} from 'shared-types';
import { meetingDomain } from '../../../domains';

import { $profileStore } from '../../../profile/profile/model';
import { $meetingUsersStore } from '../../users/meetingUsers/model';

import { MeetingUser, Profile } from '../../../types';
import { UpdateTemplatePayload } from '../../../profile/types';

export const initialTemplateState: IUserTemplate = {
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
    paywallCurrency: 'USD',
    paywallPrice: null,
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

export const $meetingTemplateStore =
    meetingDomain.createStore<IUserTemplate>(initialTemplateState);

export const $isUserSendEnterRequest =
    meetingDomain.createStore<boolean>(false);
export const $isMeetingInstanceExists = $meetingTemplateStore.map(state =>
    Boolean(state?.meetingInstance?.id),
);

/* This is old store */
// export const $isOwner = combine<{
//     meetingTemplate: IUserTemplate;
//     profile: Profile;
// }>({
//     meetingTemplate: $meetingTemplateStore,
//     profile: $profileStore,
// }).map(
//     ({ meetingTemplate, profile }) =>
//         Boolean(profile.id) &&
//         meetingTemplate?.meetingInstance?.owner === profile.id,
// );

export const $isOwnerInMeeting = combine<{
    template: IUserTemplate;
    users: MeetingUser[];
}>({
    users: $meetingUsersStore,
    template: $meetingTemplateStore,
}).map(({ users, template }) =>
    Boolean(
        users.find(
            user =>
                user.profileId === template?.meetingInstance?.owner &&
                user.accessStatus === MeetingAccessStatusEnum.InMeeting
        ),
    ),
);

export const $isOwnerDoNotDisturb = combine<{
    template: IUserTemplate;
    users: MeetingUser[];
}>({
    users: $meetingUsersStore,
    template: $meetingTemplateStore,
}).map(({ users, template }) =>
    Boolean(
        users.find(
            user =>
                user.profileId === template?.meetingInstance?.owner &&
                user.doNotDisturb //For 'do not disturb' action in meeting
        ),
    ),
);



export const setIsUserSendEnterRequest = meetingDomain.createEvent<boolean>(
    'setIsUserSendEnterRequest',
);

export const resetMeetingTemplateStoreEvent = meetingDomain.createEvent(
    'resetMeetingTemplateStoreEvent',
);

export const getMeetingTemplateFx = meetingDomain.createEffect<
    { templateId: IUserTemplate['id']; subdomain?: IUserTemplate['subdomain'] },
    IUserTemplate,
    ErrorState
>('getMeetingTemplateFx');

export const updateMeetingTemplateFx = meetingDomain.createEffect<
    UpdateTemplatePayload,
    SuccessResult<IUserTemplate> | FailedResult<ErrorState>,
    ErrorState
>('updateMeetingTemplateFx');

export const updateMeetingTemplateFxWithData = attach<
    Partial<IUserTemplate>,
    Store<{
        meetingTemplate: IUserTemplate;
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
    source: combine<{ meetingTemplate: IUserTemplate; profile: Profile }>({
        meetingTemplate: $meetingTemplateStore,
        profile: $profileStore,
    }),
});
