import {
    DeleteCommonTemplatePayload,
    GetCommonTemplateByIdPayload,
    ICommonTemplate,
    QueryParams,
    UpdateCommonTemplatePayload,
    UploadCommonTemplateFilePayload,
} from 'shared-types';

import { templatesDomain } from '../domains';
import { CommonTemplatesListState, CommonTemplateState } from '../types';

export const updateCommonTemplateDataEvent = templatesDomain.createEvent<
    Partial<ICommonTemplate>
>('updateCommonTemplateDataEvent');

export const resetCommonTemplateStore = templatesDomain.createEvent(
    'resetCommonTemplateStore',
);

export const setActiveTemplateIdEvent = templatesDomain.createEvent<
    ICommonTemplate['id'] | null
>('setActiveTemplateIdEvent');

export const getCommonTemplatesFx = templatesDomain.createEffect<
    QueryParams,
    CommonTemplatesListState,
    void
>('getCommonTemplatesFx');

export const createTemplateFx = templatesDomain.createEffect<
    boolean | undefined,
    CommonTemplateState & { withSubdomain?: boolean },
    void
>('createTemplateFx');

export const deleteCommonTemplateFx = templatesDomain.createEffect<
    DeleteCommonTemplatePayload,
    CommonTemplateState,
    void
>('deleteCommonTemplateFx');

export const createFeaturedTemplateFx = templatesDomain.createEffect<
    void,
    CommonTemplateState,
    void
>('createFeaturedTemplateFx');

export const getCommonTemplateFx = templatesDomain.createEffect<
    GetCommonTemplateByIdPayload,
    CommonTemplateState,
    void
>('getCommonTemplateFx');

export const getCommonTemplateEvent =
    templatesDomain.createEvent<GetCommonTemplateByIdPayload>(
        'getCommonTemplateEvent',
    );

export const updateCommonTemplateFx = templatesDomain.createEffect<
    UpdateCommonTemplatePayload,
    CommonTemplateState,
    void
>('updateCommonTemplateFx');

export const uploadTemplateBackgroundFx = templatesDomain.createEffect<
    UploadCommonTemplateFilePayload,
    CommonTemplateState,
    void
>('uploadTemplateBackgroundFx');

export const isUploadTemplateBackgroundInProgress = templatesDomain.createStore(false)
    .on(uploadTemplateBackgroundFx.pending, (_, pending) => pending)
    .reset(resetCommonTemplateStore);

export const $activeTemplateIdStore = templatesDomain.createStore<
    ICommonTemplate['id'] | null
>(null).on(setActiveTemplateIdEvent, (state, data) => data);


export const $commonTemplates =
    templatesDomain.createStore<CommonTemplatesListState>({
        state: {
            count: 0,
            list: [],
        },
        error: null,
    }).on(getCommonTemplatesFx.doneData, (state, data) => data)
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


export const $commonTemplateStore =
    templatesDomain.createStore<CommonTemplateState>({
        state: undefined,
        error: null,
    }).on(
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