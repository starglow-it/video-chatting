import Router from "next/router";

import { handleGetCommonTemplates } from "./handlers/handleGetCommonTemplates";
import { handleCreateCommonTemplate } from "./handlers/handleCreateCommonTemplate";
import { handleUploadCommonTemplateBackground } from "./handlers/handleUploadCommonTemplateBackground";
import { handleGetCommonTemplate } from "./handlers/handleGetCommonTemplate";

import {
    $commonTemplates,
    $commonTemplateStore,
    createTemplateFx, getCommonTemplateFx,
    getCommonTemplatesFx,
    uploadTemplateFileFx
} from "./model";

getCommonTemplatesFx.use(handleGetCommonTemplates);
createTemplateFx.use(handleCreateCommonTemplate);
uploadTemplateFileFx.use(handleUploadCommonTemplateBackground);
getCommonTemplateFx.use(handleGetCommonTemplate);

$commonTemplates.on(
    getCommonTemplatesFx.doneData,
    (state, data) => data)

$commonTemplateStore.on([
    createTemplateFx.doneData,
    uploadTemplateFileFx.doneData,
    getCommonTemplateFx.doneData,
], (state, data) => data);

createTemplateFx.doneData.watch((data) => {
    if (data.state?.id) {
        Router.push(`rooms/create/${data.state?.id}`);
    }
})
