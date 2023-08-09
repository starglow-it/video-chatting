import Router from 'next/router';
import { ICommonTemplate } from 'shared-types';
import { sample } from 'effector-next';

import {
    $activeTemplateIdStore,
    $commonTemplates,
    $commonTemplateStore,
    $isUploadTemplateBackgroundInProgress,
    createFeaturedTemplateFx,
    createTemplateFx,
    deleteCommonTemplateFx,
    getCommonTemplateEvent,
    getCommonTemplateFx,
    getCommonTemplatesFx,
    resetCommonTemplateStore,
    setActiveTemplateIdEvent,
    updateCommonTemplateDataEvent,
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

$commonTemplates
    .on(getCommonTemplatesFx.doneData, (state, data) => data)
    .on(updateCommonTemplateFx.doneData, (state, data) => ({
        ...state,
        state: {
            ...state.state,
            list: state.state.list.map(template =>
                data.state && template.id === data.state?.id
                    ? data.state
                    : template,
            ),
        },
    }))
    .on(deleteCommonTemplateFx.done, (state, { params }) => ({
        ...state,
        state: {
            count: state.state.count - 1,
            list: state.state.list.filter(
                template => template?.id !== params.templateId,
            ),
        },
    }));

$commonTemplateStore
    .on(
        [
            createTemplateFx.doneData,
            getCommonTemplateFx.doneData,
            uploadTemplateBackgroundFx.doneData,
            createFeaturedTemplateFx.doneData,
        ],
        (state, data) =>
            data.state
                ? data
                : {
                      ...state,
                      error: data.error,
                  },
    )
    .on(updateCommonTemplateDataEvent, (state, data) => ({
        ...state,
        state: {
            ...state.state,
            ...data,
        } as ICommonTemplate,
    }))
    .reset([resetCommonTemplateStore]);

$isUploadTemplateBackgroundInProgress.reset(resetCommonTemplateStore);

$activeTemplateIdStore.on(setActiveTemplateIdEvent, (state, data) => data);

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
