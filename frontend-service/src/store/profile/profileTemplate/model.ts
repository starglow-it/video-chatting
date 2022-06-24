import {attach} from "effector-next";
import {initialProfileTemplateState} from "./const";
import {profileDomain} from "../domain/model";
import {Profile, Template, UpdateTemplateData} from "../../types";
import {$profileStore} from "../profile/model";

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
