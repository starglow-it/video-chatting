import { $setUpTemplateStore, getTemplateFx } from './model';
import { handleFetchCommonTemplate } from '../handlers/handleFetchCommonTemplate';

getTemplateFx.use(handleFetchCommonTemplate);

$setUpTemplateStore.on(getTemplateFx.doneData, (state, data) => {
    return data;
});
