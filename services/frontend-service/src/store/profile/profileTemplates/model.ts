import { attach } from 'effector-next';
import { ICommonTemplate, IUserTemplate } from 'shared-types';
import { profileDomain } from '../../domains';

import { $profileStore } from '../profile/model';

import { initialProfileTemplatesStore } from './const';

import { EntityList, Profile, ProfileTemplatesCountState } from '../../types';

import {
    DeleteProfileTemplatesPayload,
    GetProfileTemplatesCountPayload,
    GetProfileTemplatesPayload,
    GetProfileTemplatesResponse,
} from '../types';

import { templatesDomain } from '../../templates/domain/model';
import {
    EditUserTemplatePayload,
    EditUserTemplateResponse,
} from '../../templates/types';

export const $profileTemplatesStore = profileDomain.createStore<
    EntityList<IUserTemplate>
>(initialProfileTemplatesStore);
export const $skipProfileTemplates = profileDomain.createStore<number>(6);
export const $deleteProfileTemplateId =
    profileDomain.createStore<IUserTemplate['id']>('');
export const $profileTemplatesCountStore =
    profileDomain.createStore<ProfileTemplatesCountState>({
        state: {
            count: 0,
        },
        error: null,
    });

export const setSkipProfileTemplates = profileDomain.createEvent<number>(
    'setSkipProfileTemplates',
);
export const setDeleteTemplateIdEvent = profileDomain.createEvent<
    IUserTemplate['id']
>('setDeleteTemplateIdEvent');

export const getProfileTemplatesBase = profileDomain.createEffect<
    GetProfileTemplatesPayload,
    GetProfileTemplatesResponse,
    void
>('getProfileTemplatesBase');

export const getProfileTemplatesCountBase = profileDomain.createEffect<
    GetProfileTemplatesCountPayload,
    ProfileTemplatesCountState,
    void
>('getProfileTemplatesCountBase');

export const deleteProfileTemplateFx = profileDomain.createEffect<
    DeleteProfileTemplatesPayload,
    void,
    void
>('deleteProfileTemplateFx');

export const getProfileTemplateByTemplateIdFx = templatesDomain.effect<
    { templateId: ICommonTemplate['templateId'] },
    IUserTemplate | null | undefined,
    void
>('getUserTemplateByTemplateIdFx');

export const getProfileTemplatesFx = attach({
    effect: getProfileTemplatesBase,
    source: $profileStore,
    mapParams: ({ limit, skip }, profile: Profile) => ({
        userId: profile.id,
        limit,
        skip,
    }),
});

export const getProfileTemplatesCountFx = attach({
    effect: getProfileTemplatesCountBase,
    source: $profileStore,
    mapParams: ({ limit, skip, templateType }, profile: Profile) => ({
        userId: profile.id,
        limit,
        skip,
        templateType,
    }),
});

export const editUserTemplateFx = templatesDomain.effect<
    EditUserTemplatePayload,
    EditUserTemplateResponse,
    void
>('editUserTemplateFx');
