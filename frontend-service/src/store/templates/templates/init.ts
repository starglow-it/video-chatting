import { $templatesStore, getTemplatesFx } from './model';
import { handleFetchTemplates } from '../handlers';

getTemplatesFx.use(handleFetchTemplates);

$templatesStore.on(getTemplatesFx.doneData, (state, data) => {
    return {
        ...state,
        ...data,
    };
});
