import { combine } from "effector-next";

import { meetingDomain } from '../domain';

import { ErrorState, UpdateTemplateData, UserTemplate } from '../../types';

import { $profileStore } from "../../profile";

export const initialTemplateState: UserTemplate = {
    id: '',
    templateId: 0,
    url: '',
    name: '',
    maxParticipants: 0,
    businessCategories: [],
    description: '',
    previewUrl: '',
    type: '',
    companyName: '',
    contactEmail: '',
    fullName: '',
    position: '',
    languages: [],
    socials: [],
    usedAt: '',
};

export const $meetingTemplateStore = meetingDomain.store<UserTemplate>(initialTemplateState);

export const $isMeetingInstanceExists = $meetingTemplateStore.map((state) => state?.meetingInstance?.id);

export const $isOwner = combine({ meetingTemplate: $meetingTemplateStore, profile: $profileStore })
    .map(({ meetingTemplate, profile }) => meetingTemplate.meetingInstance?.owner === profile.id);

export const $isUserSendEnterRequest = meetingDomain.store<boolean>(false);

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
