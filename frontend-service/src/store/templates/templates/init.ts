import { $templatesStore, getTemplatesFx } from './model';
import { handleFetchTemplates } from '../handlers/handleFetchTemplates';

getTemplatesFx.use(handleFetchTemplates);

$templatesStore.on(getTemplatesFx.doneData, (state, data) => ({
    ...state,
    ...data,
}));
