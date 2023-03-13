import {ICommonTemplate, ICommonUser, IUserTemplate, QueryParams} from 'shared-types';
import { EntityList } from '../types';
import { templatesDomain } from './domain/model';
import {
    AddTemplateToUserEffectPayload,
    AddTemplateToUserEffectResponse,
    CreateTemplateResponse,
    DeleteCommonTemplatePayload,
    EditTemplatePayload,
    EditTemplateResponse,
    GetEditingTemplatePayload,
    GetEditingTemplateResponse,
    GetUserTemplateByIdPayload,
    GetUserTemplatePayload,
    PurchaseTemplatePayload,
    SendScheduleInvitePayload,
    UploadTemplateFilePayload,
    UploadTemplateFileResponse,
    UploadUserTemplateFilePayload,
    UploadUserTemplateFileResponse,
} from './types';

const initialTemplatesStore: EntityList<ICommonTemplate> = {
    list: [],
    count: 0,
};

const initialUserTemplatesStore: EntityList<IUserTemplate> = {
    list: [],
    count: 0,
};

// stores
export const $templatesStore =
    templatesDomain.createStore<EntityList<ICommonTemplate>>(initialTemplatesStore);
export const $setUpTemplateStore = templatesDomain.createStore<ICommonTemplate | null>(null);
export const $templatePreviewStore = templatesDomain.createStore<ICommonTemplate | null>(null);
export const $discoveryTemplatesStore =
    templatesDomain.createStore<EntityList<IUserTemplate>>(initialUserTemplatesStore);
export const $scheduleTemplateIdStore = templatesDomain.createStore<IUserTemplate['id']>('');
export const $scheduleEventLinkStore = templatesDomain.createStore<string>('');
export const $replaceTemplateIdStore = templatesDomain.createStore<ICommonTemplate['id']>('');
export const $templateDraft = templatesDomain.createStore<ICommonTemplate | IUserTemplate | null>(
    null,
);

// events
export const setPreviewTemplate = templatesDomain.event<ICommonTemplate | null>(
    'setPreviewTemplate',
);
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
    QueryParams & { userId?: ICommonUser['id']; draft: boolean; isPublic: boolean },
    EntityList<ICommonTemplate>,
    void
>('getTemplatesFx');

export const getTemplateFx = templatesDomain.effect<
    { templateId: ICommonTemplate['id'] },
    ICommonTemplate | undefined,
    void
>('getTemplateFx');

export const getUsersTemplatesFx = templatesDomain.effect<
    QueryParams,
    EntityList<IUserTemplate> | null | undefined,
    void
>('getUsersTemplatesFx');

export const getUserTemplateFx = templatesDomain.effect<
    GetUserTemplatePayload,
    IUserTemplate | null | undefined,
    void
>('getUserTemplateFx');

export const getUserTemplateByIdFx = templatesDomain.effect<
    GetUserTemplateByIdPayload,
    IUserTemplate | null | undefined,
    void
>('getUserTemplateByIdFx');

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

export const addTemplateToUserFx = templatesDomain.effect<AddTemplateToUserEffectPayload,AddTemplateToUserEffectResponse,void>('addTemplateToUserFx');

export const clearTemplateDraft = templatesDomain.event('clearTemplateDraft');

export const deleteCommonTemplateFx = templatesDomain.effect<
    DeleteCommonTemplatePayload,
    boolean,
    void
>('deleteCommonTemplateFx');

export const $isUploadTemplateBackgroundInProgress = uploadTemplateFileFx.pending;

