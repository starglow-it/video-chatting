import {
    $deleteProfileTemplateId,
    $profileTemplatesStore, $skipProfileTemplates,
    deleteProfileTemplateFx,
    getProfileTemplatesBase,
    getProfileTemplatesFx, setDeleteTemplateIdEvent, setSkipProfileTemplates
} from './model';
import { handleFetchProfileTemplates } from '../handlers/handleFetchProfileTemplates';
import {handleDeleteProfileTemplate} from "../handlers/handleDeleteProfileTemplate";

getProfileTemplatesBase.use(handleFetchProfileTemplates);
deleteProfileTemplateFx.use(handleDeleteProfileTemplate);

$profileTemplatesStore
    .on(getProfileTemplatesFx.doneData, (state, data) => data)

$deleteProfileTemplateId.on(setDeleteTemplateIdEvent, (state, data) => data);

$skipProfileTemplates.on(setSkipProfileTemplates, (state, data) => data);
