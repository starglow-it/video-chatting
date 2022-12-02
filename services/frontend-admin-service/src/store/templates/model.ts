import {
    GetCommonTemlatePayload,
    QueryParams,
    UploadCommonTemplateFilePayload,
} from "shared-types";

import {templatesDomain} from "../domains";
import {CommonTemplatesListState, CommonTemplateState} from "../types";

export const $commonTemplates = templatesDomain.createStore<CommonTemplatesListState>({
    state: {
        count: 0,
        list: [],
    },
    error: null,
});

export const $commonTemplateStore = templatesDomain.createStore<CommonTemplateState>({
    state: undefined,
    error: null,
});

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

export const uploadTemplateFileFx = templatesDomain.createEffect<
    UploadCommonTemplateFilePayload,
    CommonTemplateState,
    void
    >('uploadTemplateFileFx');

export const getCommonTemplateFx = templatesDomain.createEffect<
    GetCommonTemlatePayload,
    CommonTemplateState,
    void
    >('getCommonTemplateFx');