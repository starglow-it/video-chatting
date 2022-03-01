import { $templatePreviewStore, setPreviewTemplate } from './model';
import { Template } from '../../types';

$templatePreviewStore.on(setPreviewTemplate, (_state, data: Template | null) => data);
