import { templatesDomain } from '../domain';
import {Template, UserTemplate} from '../../types';

export const $templatePreviewStore = templatesDomain.store<Template | UserTemplate | null>(null);

export const setPreviewTemplate = templatesDomain.event<Template | UserTemplate | null>('setPreviewTemplate');
