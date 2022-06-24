import { templatesDomain } from '../domain/model';
import { EntityList, Template } from '../../types';

const initialTemplatesStore: EntityList<Template> = {
    list: [],
    count: 0,
};

export const $templatesStore = templatesDomain.store<EntityList<Template>>(initialTemplatesStore);

export const getTemplatesFx = templatesDomain.effect<
    { limit: number; skip: number },
    EntityList<Template> | null | undefined,
    void
>('getTemplatesFx');
