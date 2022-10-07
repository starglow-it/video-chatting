import { EntityList, Template, UserTemplate } from '../types';
import { templatesDomain } from './domain/model';
import { IUserTemplate } from '../../../../shared/interfaces/user-template.interface';
import {
    CreateTemplateResponse,
    EditTemplatePayload,
    EditTemplateResponse,
    EditUserTemplateResponse,
    GetEditingTemplatePayload,
    GetEditingTemplateResponse,
    GetUserTemplatePayload,
    PurchaseTemplatePayload,
    SendScheduleInvitePayload,
    UploadTemplateFilePayload,
    UploadTemplateFileResponse,
    UploadUserTemplateFilePayload,
    UploadUserTemplateFileResponse,
} from './types';

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
export const $templateDraft = templatesDomain.createStore<Template | IUserTemplate | null>(null);

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
    GetUserTemplatePayload,
    UserTemplate | null | undefined,
    void
>('getUserTemplateFx');

export const purchaseTemplateFx = templatesDomain.effect<
    PurchaseTemplatePayload,
    { url: string },
    void
>('purchaseTemplateFx');

export const sendScheduleInviteFx = templatesDomain.effect<
    SendScheduleInvitePayload,
    string | undefined,
    void
>('sendScheduleInviteFx');

export const uploadTemplateFileFx = templatesDomain.effect<
    UploadTemplateFilePayload,
    UploadTemplateFileResponse,
    void
>('uploadTemplateFile');

export const uploadUserTemplateFileFx = templatesDomain.effect<
    UploadUserTemplateFilePayload,
    UploadUserTemplateFileResponse,
    void
>('uploadUserTemplateFile');

export const editUserTemplateFileFx = templatesDomain.effect<
    UploadUserTemplateFilePayload,
    EditUserTemplateResponse,
    void
>('editUserTemplateFile');

export const createTemplateFx = templatesDomain.effect<void, CreateTemplateResponse, void>(
    'createTemplate',
);

export const editTemplateFx = templatesDomain.effect<
    EditTemplatePayload,
    EditTemplateResponse,
    void
>('editTemplate');

export const getEditingTemplateFx = templatesDomain.effect<
    GetEditingTemplatePayload,
    GetEditingTemplateResponse,
    void
>('getEditingTemplateFx');

export const clearTemplateDraft = templatesDomain.event('clearTemplateDraft');
