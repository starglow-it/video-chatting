import {
    $deleteProfileTemplateId,
    $profileTemplatesStore,
    $skipProfileTemplates,
    deleteProfileTemplateFx,
    getProfileTemplateByTemplateIdFx,
    getProfileTemplatesBase,
    getProfileTemplatesFx,
    setDeleteTemplateIdEvent,
    setSkipProfileTemplates,
} from './model';
import { handleFetchProfileTemplates } from '../handlers/handleFetchProfileTemplates';
import { handleDeleteProfileTemplate } from '../handlers/handleDeleteProfileTemplate';
import { handleFetchProfileTemplateByTemplateId } from '../handlers/handleFetchProfileTemplateByTemplateId';

getProfileTemplatesBase.use(handleFetchProfileTemplates);
deleteProfileTemplateFx.use(handleDeleteProfileTemplate);
getProfileTemplateByTemplateIdFx.use(handleFetchProfileTemplateByTemplateId);

$profileTemplatesStore.on(getProfileTemplatesFx.doneData, (state, data) => data);

$deleteProfileTemplateId.on(setDeleteTemplateIdEvent, (state, data) => data);

$skipProfileTemplates.on(setSkipProfileTemplates, (state, data) => data);
