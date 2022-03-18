import { meetingDomain } from '../domain';

import { ErrorState, UpdateTemplateData, Template } from '../../types';

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

export const getMeetingTemplateFx = meetingDomain.effect<
    { templateId: Template['id'] },
    Template,
    ErrorState
>('getMeetingTemplateFx');

export const updateMeetingTemplateFx = meetingDomain.effect<
    UpdateTemplateData,
    Template,
    ErrorState
>('updateMeetingTemplateFx');
