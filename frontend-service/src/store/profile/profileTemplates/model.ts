import { attach } from 'effector-next';

import { profileDomain } from '../domain';

import { $profileStore } from '../profile';

import { EntityList, Profile, Template, UserTemplate } from '../../types';

import { initialProfileTemplatesStore } from './const';

export const $profileTemplatesStore = profileDomain.store<EntityList<Template>>(
    initialProfileTemplatesStore,
);

export const $skipProfileTemplates = profileDomain.store<number>(0);
export const $deleteProfileTemplateId = profileDomain.store<UserTemplate['id']>('');

export const setSkipProfileTemplates = profileDomain.event<number>('setSkipProfileTemplates');
export const setDeleteTemplateIdEvent = profileDomain.event<UserTemplate['id']>(
    'setDeleteTemplateIdEvent',
);

export const getProfileTemplatesBase = profileDomain.effect<
    { limit: number; skip: number; userId: string },
    EntityList<Template>,
    void
>('getProfileTemplatesBase');

export const getProfileTemplatesFx = attach({
    effect: getProfileTemplatesBase,
    source: $profileStore,
    mapParams: ({ limit, skip }, profile: Profile) => ({ userId: profile.id, limit, skip }),
});

export const deleteProfileTemplateFx = profileDomain.effect<
    { templateId: UserTemplate['id'] },
    void,
    void
>('deleteProfileTemplateFx');
