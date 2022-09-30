import { EntityList, Template, UploadTemplateFile, UserTemplate } from '../types';
import { templatesDomain } from './domain/model';
import { ParsedTimeStamp } from '../../types';
import { IUserTemplate } from '../../../../shared/interfaces/user-template.interface';

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
    { templateId: Template['id'] },
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

export const uploadTemplateFileFx = templatesDomain.effect<
    { id: string; file: File },
    Template | null,
    void
>('uploadTemplateFile');

export const uploadUserTemplateFileFx = templatesDomain.effect<
    { templateId: string; data: { file: File } },
    UserTemplate | null,
    void
>('uploadUserTemplateFile');

export const editUserTemplateFileFx = templatesDomain.effect<
    Omit<Partial<UserTemplate>, 'businessCategories'> & UploadTemplateFile,
    UserTemplate | null,
    void
>('editUserTemplateFile');

export const createTemplateFx = templatesDomain.effect<void, Template | undefined, void>(
    'createTemplate',
);

export const editTemplateFx = templatesDomain.effect<
    Omit<Partial<Template>, 'businessCategories' | 'previewUrls'> & UploadTemplateFile,
    Template | null,
    void
>('editTemplate');

export const getEditingTemplateFx = templatesDomain.effect<
    { templateId: UserTemplate['id'] },
    UserTemplate | undefined,
    void
    >('getEditingTemplateFx');

export const clearTemplateDraft = templatesDomain.event('clearTemplateDraft');
