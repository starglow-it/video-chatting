import { EntityList, Template, UserTemplate } from '../types';
import { templatesDomain } from './domain/model';
import { ParsedTimeStamp } from '../../types';

const initialTemplatesStore: EntityList<Template> = {
    list: [],
    count: 0,
};

const initialUserTemplatesStore: EntityList<UserTemplate> = {
    list: [],
    count: 0,
};

// stores
export const $templatesStore =
    templatesDomain.createStore<EntityList<Template>>(initialTemplatesStore);
export const $setUpTemplateStore = templatesDomain.createStore<Template | null>(null);
export const $templatePreviewStore = templatesDomain.createStore<Template | null>(null);
export const $discoveryTemplatesStore =
    templatesDomain.createStore<EntityList<UserTemplate>>(initialUserTemplatesStore);
export const $scheduleTemplateIdStore = templatesDomain.createStore<UserTemplate['id']>('');
export const $scheduleEventLinkStore = templatesDomain.createStore<string>('');
export const $replaceTemplateIdStore = templatesDomain.createStore<Template['id']>('');

// events
export const setPreviewTemplate = templatesDomain.event<Template | null>('setPreviewTemplate');
export const setScheduleTemplateIdEvent = templatesDomain.event<string>(
    'setScheduleTemplateIdEvent',
);
export const setScheduleEventLinkEvent = templatesDomain.event<string | undefined>(
    'setScheduleEventLinkEvent',
);

export const setReplaceTemplateIdEvent = templatesDomain.event<string | undefined>(
    'setReplaceTemplateIdEvent',
);

// effect
export const getTemplatesFx = templatesDomain.effect<
    { limit: number; skip: number },
    EntityList<Template> | null | undefined,
    void
>('getTemplatesFx');

export const getTemplateFx = templatesDomain.effect<
    { templateId: Template['id'] },
    Template | undefined,
    void
>('getTemplateFx');

export const getUsersTemplatesFx = templatesDomain.effect<
    { limit: number; skip: number },
    EntityList<UserTemplate> | null | undefined,
    void
>('getUsersTemplatesFx');

export const getUserTemplateFx = templatesDomain.effect<
    { templateId: Template['templateId'] },
    UserTemplate | null | undefined,
    void
>('getUserTemplateFx');

export const purchaseTemplateFx = templatesDomain.effect<
    { templateId: Template['id'] },
    { url: string },
    void
>('purchaseTemplateFx');

export const sendScheduleInviteFx = templatesDomain.effect<
    {
        templateId: string;
        timeZone: string;
        comment: string;
        startAt: ParsedTimeStamp;
        endAt: ParsedTimeStamp;
        userEmails: string[];
    },
    string | undefined,
    void
>('sendScheduleInviteFx');
