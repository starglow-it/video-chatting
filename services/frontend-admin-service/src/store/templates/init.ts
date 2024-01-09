import Router from 'next/router';
import { sample } from 'effector-next';

import {
    createFeaturedTemplateFx,
    createTemplateFx,
    deleteCommonTemplateFx,
    getCommonTemplateEvent,
    getCommonTemplateFx,
    getCommonTemplatesFx,
    updateCommonTemplateFx,
    uploadTemplateBackgroundFx,
} from './model';

import { handleDeleteCommonTemplate } from './handlers/handleDeleteCommonTemplate';
import { handleUpdateCommonTemplate } from './handlers/handleUpdateCommonTemplate';
import { handleGetCommonTemplates } from './handlers/handleGetCommonTemplates';
import { handleCreateCommonTemplate } from './handlers/handleCreateCommonTemplate';
import { handleUploadCommonTemplateBackground } from './handlers/handleUploadCommonTemplateBackground';
import { handleGetCommonTemplate } from './handlers/handleGetCommonTemplate';
import { handleCreateFeaturedTemplate } from './handlers/handleCreateFeaturedTemplate';

getCommonTemplatesFx.use(handleGetCommonTemplates);
createTemplateFx.use(handleCreateCommonTemplate);
getCommonTemplateFx.use(handleGetCommonTemplate);
deleteCommonTemplateFx.use(handleDeleteCommonTemplate);
updateCommonTemplateFx.use(handleUpdateCommonTemplate);
uploadTemplateBackgroundFx.use(handleUploadCommonTemplateBackground);
createFeaturedTemplateFx.use(handleCreateFeaturedTemplate);

createTemplateFx.doneData.watch(data => {
    if (data.state?.id) {
        Router.push(
            `rooms/create/${data.state?.id}/${data.withSubdomain ?? ''}`,
        );
    }
});

createFeaturedTemplateFx.doneData.watch(data => {
    if (data.state?.id) {
        Router.push(`rooms/create/${data.state?.id}`);
    }
});

sample({
    clock: getCommonTemplateEvent,
    source: getCommonTemplateFx.pending,
    filter: isInProgress => !isInProgress,
    fn: (isInProgress, payload) => payload,
    target: getCommonTemplateFx,
});