import { templatesDomain } from '../domain';
import {EntityList, UserTemplate } from "../../types";

const initialTemplatesStore: EntityList<UserTemplate> = {
    list: [],
    count: 0,
};

export const $discoveryTemplatesStore = templatesDomain.store<EntityList<UserTemplate>>(initialTemplatesStore);

export const getUsersTemplatesFx = templatesDomain.effect<
    { limit: number; skip: number },
    EntityList<UserTemplate> | null | undefined,
    void
    >('getUsersTemplatesFx');
