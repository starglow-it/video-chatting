import { templatesDomain } from '../domain';
import { EntityList, UserTemplate } from "../../types";

const initialTemplatesStore: EntityList<UserTemplate> = {
    list: [],
    count: 0,
};

export const $discoveryTemplatesStore = templatesDomain.store<EntityList<UserTemplate>>(initialTemplatesStore);
export const $scheduleTemplateIdStore = templatesDomain.store<UserTemplate["id"]>("");
export const $scheduleEventLinkStore = templatesDomain.store<string>("");
export const $isIcsEventLinkAvailableStore = $scheduleEventLinkStore.map(state => Boolean(state));

export const setScheduleTemplateIdEvent = templatesDomain.event<string>("setScheduleTemplateIdEvent");
export const setScheduleEventLinkEvent = templatesDomain.event<string | undefined>("setScheduleEventLinkEvent");

export const getUsersTemplatesFx = templatesDomain.effect<
    { limit: number; skip: number },
    EntityList<UserTemplate> | null | undefined,
    void
    >('getUsersTemplatesFx');

export const sendScheduleInviteFx = templatesDomain.effect<
    { templateId: string; timeZone: string; comment: string; startAt: any; endAt: any; },
    string | undefined,
    void
    >('sendScheduleInviteFx');
