import { attach } from 'effector-next';

import { meetingDomain } from '../domain';
import { ErrorState, UpdateTemplateData, Template, Meeting } from '../../types';
import { $meetingStore } from '../meeting';

export const initialTemplateState: Template = {
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

export const $meetingTemplateStore = meetingDomain.store<Template>(initialTemplateState);

export const getUserTemplateBaseEffect = meetingDomain.effect<
    { templateId: Template['id']; userId: string },
    Template,
    ErrorState
>('getUserTemplateBaseEffect');

export const updateMeetingTemplateBaseEffect = meetingDomain.effect<
    UpdateTemplateData,
    Template,
    ErrorState
>('updateMeetingTemplateBaseEffect');

export const getMeetingTemplateFx = attach({
    effect: getUserTemplateBaseEffect,
    source: $meetingStore,
    mapParams: ({ templateId }, meeting: Meeting) => ({ templateId, userId: meeting.ownerProfileId }),
});

export const updateMeetingTemplateFx = attach({
    effect: updateMeetingTemplateBaseEffect,
    source: $meetingStore,
    mapParams: ({ templateId, data }, meeting: Meeting) => ({
        templateId,
        userId: meeting.ownerProfileId,
        data,
    }),
});
