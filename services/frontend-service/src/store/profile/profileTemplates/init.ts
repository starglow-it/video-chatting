import {
    $deleteProfileTemplateId,
    $profileTemplatesCountStore,
    $profileTemplatesStore,
    $skipProfileTemplates,
    deleteProfileTemplateFx,
    getProfileTemplateByTemplateIdFx,
    getProfileTemplatesBase,
    getProfileTemplatesCountBase,
    getProfileTemplatesCountFx,
    getProfileTemplatesFx,
    setDeleteTemplateIdEvent,
    setSkipProfileTemplates,
} from './model';
import { handleFetchProfileTemplates } from '../handlers/handleFetchProfileTemplates';
import { handleFetchProfileTemplatesCount } from '../handlers/handleFetchProfileTemplatesCount';
import { handleDeleteProfileTemplate } from '../handlers/handleDeleteProfileTemplate';
import { handleFetchProfileTemplateByTemplateId } from '../handlers/handleFetchProfileTemplateByTemplateId';

getProfileTemplatesBase.use(handleFetchProfileTemplates);
getProfileTemplatesCountBase.use(handleFetchProfileTemplatesCount);
deleteProfileTemplateFx.use(handleDeleteProfileTemplate);
getProfileTemplateByTemplateIdFx.use(handleFetchProfileTemplateByTemplateId);

$profileTemplatesStore.on(getProfileTemplatesFx.doneData, (state, data) => data);

$deleteProfileTemplateId.on(setDeleteTemplateIdEvent, (state, data) => data);

$skipProfileTemplates.on(setSkipProfileTemplates, (state, data) => data);

$profileTemplatesCountStore.on(getProfileTemplatesCountFx.doneData, (state, data) => data);
