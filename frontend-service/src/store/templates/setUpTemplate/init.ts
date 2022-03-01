import { $setUpTemplateStore, getTemplateFx } from './model';
import { handleFetchCommonTemplate } from '../handlers';

getTemplateFx.use(handleFetchCommonTemplate);

$setUpTemplateStore.on(getTemplateFx.doneData, (state, data) => {
    return data;
});
