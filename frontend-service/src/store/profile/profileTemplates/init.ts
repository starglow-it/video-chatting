import { $profileTemplatesStore, getProfileTemplatesBase, getProfileTemplatesFx } from './model';
import { handleFetchProfileTemplates } from '../handlers/handleFetchProfileTemplates';

getProfileTemplatesBase.use(handleFetchProfileTemplates);

$profileTemplatesStore.on(getProfileTemplatesFx.doneData, (state, data) => data);
