import { templatesDomain } from '../domain';
import { Template } from '../../types';

export const $templatePreviewStore = templatesDomain.store<Template | null>(null);

export const setPreviewTemplate = templatesDomain.event<Template | null>('setPreviewTemplate');
