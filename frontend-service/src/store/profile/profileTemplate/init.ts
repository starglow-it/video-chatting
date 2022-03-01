import {
    $profileTemplateStore,
    getProfileTemplateBaseEffect,
    resetProfileTemplateEvent,
    updateProfileTemplateBaseEffect,
} from './model';
import { handleFetchProfileTemplate } from '../handlers/handleFetchProfileTemplate';
import { handleUpdateProfileTemplate } from '../handlers/handleUpdateProfileTemplate';

getProfileTemplateBaseEffect.use(handleFetchProfileTemplate);
updateProfileTemplateBaseEffect.use(handleUpdateProfileTemplate);

$profileTemplateStore.on(getProfileTemplateBaseEffect.doneData, (state, data) => data);

$profileTemplateStore.reset(resetProfileTemplateEvent);
