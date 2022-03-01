import { attach } from 'effector-next';

import { profileDomain } from '../domain';

import { $profileStore } from '../profile';

import { EntityList, Profile, Template } from '../../types';

import { initialProfileTemplatesStore } from './const';

export const $profileTemplatesStore = profileDomain.store<EntityList<Template>>(
    initialProfileTemplatesStore,
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
