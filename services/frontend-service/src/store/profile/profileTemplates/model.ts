import { attach } from 'effector-next';
import { profileDomain } from '../../domains';

import { $profileStore } from '../profile/model';

import { initialProfileTemplatesStore } from './const';

import { EntityList, Profile, Template, UserTemplate } from '../../types';
import {
    DeleteProfileTemplatesPayload,
    GetProfileTemplatesPayload,
    GetProfileTemplatesResponse,
} from '../types';
import { templatesDomain } from '../../templates/domain/model';

export const $profileTemplatesStore = profileDomain.createStore<EntityList<UserTemplate>>(
    initialProfileTemplatesStore,
);
export const $skipProfileTemplates = profileDomain.createStore<number>(6);
export const $deleteProfileTemplateId = profileDomain.createStore<UserTemplate['id']>('');

export const setSkipProfileTemplates = profileDomain.createEvent<number>('setSkipProfileTemplates');
export const setDeleteTemplateIdEvent = profileDomain.createEvent<UserTemplate['id']>(
    'setDeleteTemplateIdEvent',
);

export const getProfileTemplatesBase = profileDomain.createEffect<
    GetProfileTemplatesPayload,
    GetProfileTemplatesResponse,
    void
>('getProfileTemplatesBase');

export const deleteProfileTemplateFx = profileDomain.createEffect<
    DeleteProfileTemplatesPayload,
    void,
    void
>('deleteProfileTemplateFx');

export const getProfileTemplateByTemplateIdFx = templatesDomain.effect<
    { templateId: Template['templateId'] },
    UserTemplate | null | undefined,
    void
>('getUserTemplateByTemplateIdFx');

export const getProfileTemplatesFx = attach({
    effect: getProfileTemplatesBase,
    source: $profileStore,
    mapParams: ({ limit, skip }, profile: Profile) => ({ userId: profile.id, limit, skip }),
});
