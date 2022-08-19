import { attach } from 'effector-next';
import { initialProfileTemplateState } from './const';
import { Profile, UserTemplate } from '../../types';
import { $profileStore } from '../profile/model';
import { profileDomain } from '../../domains';
import { GetProfileTemplatePayload, UpdateTemplatePayload } from '../types';

export const $profileTemplateStore = profileDomain.createStore<UserTemplate>(
    initialProfileTemplateState,
);

export const resetProfileTemplateEvent = profileDomain.createEvent('resetProfileTemplateEvent');

export const getProfileTemplateBaseEffect = profileDomain.createEffect<
    GetProfileTemplatePayload,
    UserTemplate,
    void
>('getProfileTemplateFx');

export const updateProfileTemplateBaseEffect = profileDomain.createEffect<
    UpdateTemplatePayload,
    UserTemplate,
    void
>('updateProfileTemplateBaseEffect');

export const getProfileTemplateFx = attach({
    effect: getProfileTemplateBaseEffect,
    source: $profileStore,
    mapParams: ({ templateId }, profile: Profile) => ({ templateId, userId: profile.id }),
});
