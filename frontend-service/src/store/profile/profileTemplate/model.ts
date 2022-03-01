import { attach } from 'effector-next';

import { profileDomain } from '../domain';
import { $profileStore } from '../profile';

import { Profile, Template, UpdateTemplateData } from '../../types';
import { initialProfileTemplateState } from './const';

export const $profileTemplateStore = profileDomain.store<Template>(initialProfileTemplateState);

export const resetProfileTemplateEvent = profileDomain.event('resetProfileTemplateEvent');

export const getProfileTemplateBaseEffect = profileDomain.effect<
    { templateId: Template['id']; userId: Profile['id'] },
    Template,
    void
>('getProfileTemplateFx');
export const updateProfileTemplateBaseEffect = profileDomain.effect<
    UpdateTemplateData,
    Template,
    void
>('updateProfileTemplateBaseEffect');

export const getProfileTemplateFx = attach({
    effect: getProfileTemplateBaseEffect,
    source: $profileStore,
    mapParams: ({ templateId }, profile: Profile) => ({ templateId, userId: profile.id }),
});

export const updateProfileTemplateFx = attach({
    effect: updateProfileTemplateBaseEffect,
    source: $profileStore,
    mapParams: ({ templateId, data }, profile: Profile) => ({
        templateId,
        userId: profile.id,
        data,
    }),
});
