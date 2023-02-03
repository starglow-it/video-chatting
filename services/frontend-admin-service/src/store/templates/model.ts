import {
	DeleteCommonTemplatePayload,
	GetCommonTemplateByIdPayload,
	ICommonTemplate,
	QueryParams,
	UpdateCommonTemplatePayload,
	UploadCommonTemplateFilePayload,
} from 'shared-types';

import { templatesDomain } from '../domains';
import {
	CommonTemplatesListState, CommonTemplateState 
} from '../types';
export const $commonTemplates =
    templatesDomain.createStore<CommonTemplatesListState>({
    	state: {
    		count: 0,
    		list: [],
    	},
    	error: null,
    });

export const $commonTemplateStore =
    templatesDomain.createStore<CommonTemplateState>({
    	state: undefined,
    	error: null,
    });


export const $activeTemplateIdStore = templatesDomain.createStore<
    ICommonTemplate['id'] | null
>(null);

export const updateCommonTemplateDataEvent = templatesDomain.createEvent<
    Partial<ICommonTemplate>
>('updateCommonTemplateDataEvent');

export const resetCommonTemplateStore = templatesDomain.createEvent('resetCommonTemplateStore');

export const setActiveTemplateIdEvent = templatesDomain.createEvent<
    ICommonTemplate['id'] | null
>('setActiveTemplateIdEvent');

export const getCommonTemplatesFx = templatesDomain.createEffect<
    QueryParams,
    CommonTemplatesListState,
    void
>('getCommonTemplatesFx');

export const createTemplateFx = templatesDomain.createEffect<
    void,
    CommonTemplateState,
    void
>('createTemplateFx');

export const deleteCommonTemplateFx = templatesDomain.createEffect<
    DeleteCommonTemplatePayload,
    CommonTemplateState,
    void
>('deleteCommonTemplateFx');

export const getCommonTemplateFx = templatesDomain.createEffect<
    GetCommonTemplateByIdPayload,
    CommonTemplateState,
    void
>('getCommonTemplateFx');

export const getCommonTemplateEvent = templatesDomain.createEvent<GetCommonTemplateByIdPayload>('getCommonTemplateEvent');

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

export const $isUploadTemplateBackgroundInProgress = uploadTemplateBackgroundFx.pending;
