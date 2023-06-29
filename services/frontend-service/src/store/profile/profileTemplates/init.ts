import {
    $deleteProfileTemplateId,
    $profileTemplatesCountStore,
    $profileTemplatesStore,
    $skipProfileTemplates,
    deleteProfileTemplateFx,
    editUserTemplateFx,
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
import { handleEditUserTemplate } from '../handlers/handleEditUserTemplate';
import { setQueryProfileTemplatesEvent } from 'src/store/templates/model';
import { clearProfileEvent } from '../profile/model';

getProfileTemplatesBase.use(handleFetchProfileTemplates);
getProfileTemplatesCountBase.use(handleFetchProfileTemplatesCount);
deleteProfileTemplateFx.use(handleDeleteProfileTemplate);
getProfileTemplateByTemplateIdFx.use(handleFetchProfileTemplateByTemplateId);
editUserTemplateFx.use(handleEditUserTemplate);

$profileTemplatesStore
    .on(getProfileTemplatesFx.doneData, (state, data) => ({
        list: data?.isReset
            ? data.list
            : [...state.list, ...(data?.list || [])],
        count: data?.count || 0,
    }))
    .on(editUserTemplateFx.doneData, (state, data) => ({
        ...state,
        list: state.list.map(template =>
            template.id === data?.id ? data : template,
        ),
    }))
    .reset([setQueryProfileTemplatesEvent, clearProfileEvent]);

$deleteProfileTemplateId.on(setDeleteTemplateIdEvent, (state, data) => data);

$skipProfileTemplates.on(setSkipProfileTemplates, (state, data) => data);

$profileTemplatesCountStore
    .on(getProfileTemplatesCountFx.doneData, (state, data) => data)
    .reset(clearProfileEvent);
