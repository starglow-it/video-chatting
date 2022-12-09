import { attach } from 'effector-next';
import { initialProfileTemplateState } from './const';
import { Profile } from '../../types';
import { $profileStore } from '../profile/model';
import { profileDomain } from '../../domains';
import { GetProfileTemplatePayload, UpdateTemplatePayload } from '../types';
import {IUserTemplate} from "shared-types";

export const $profileTemplateStore = profileDomain.createStore<IUserTemplate>(
    initialProfileTemplateState,
);

export const resetProfileTemplateEvent = profileDomain.createEvent('resetProfileTemplateEvent');

export const getProfileTemplateBaseEffect = profileDomain.createEffect<
    GetProfileTemplatePayload,
    IUserTemplate,
    void
>('getProfileTemplateFx');

export const updateProfileTemplateBaseEffect = profileDomain.createEffect<
    UpdateTemplatePayload,
    IUserTemplate | null,
    void
>('updateProfileTemplateBaseEffect');

export const getProfileTemplateFx = attach({
    effect: getProfileTemplateBaseEffect,
    source: $profileStore,
    mapParams: ({ templateId }, profile: Profile) => ({ templateId, userId: profile.id }),
});
