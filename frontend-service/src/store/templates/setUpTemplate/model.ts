import { Template } from '../../types';
import { templatesDomain } from '../domain';

export const $setUpTemplateStore = templatesDomain.store<Template | null>(null);

export const getTemplateFx = templatesDomain.effect<
    { templateId: Template['id'] },
    Template | undefined,
    void
>('getTemplateFx');
