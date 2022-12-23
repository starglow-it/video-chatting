import Router from 'next/router';

import {handleGetCommonTemplates} from './handlers/handleGetCommonTemplates';
import {handleCreateCommonTemplate} from './handlers/handleCreateCommonTemplate';
import {handleUploadCommonTemplateBackground} from './handlers/handleUploadCommonTemplateBackground';
import {handleGetCommonTemplate} from './handlers/handleGetCommonTemplate';

import {
	$commonTemplates,
	$commonTemplateStore,
	$roomPreviewIdStore,
	createTemplateFx,
	deleteCommonTemplateFx,
	deleteCommonTemplateSoundFx,
	getCommonTemplateFx,
	getCommonTemplatesFx,
	setRoomPreviewIdEvent,
	updateCommonTemplateDataEvent,
	updateCommonTemplateFx,
	uploadTemplateFileFx,
} from './model';
import {ICommonTemplate} from "shared-types";
import {handleDeleteCommonTemplate} from "./handlers/handleDeleteCommonTemplate";
import {handleUpdateCommonTemplate} from "./handlers/handleUpdateCommonTemplate";
import {handleDeleteCommonTemplateSound} from "./handlers/handleDeleteCommonTemplateSound";
import {closeAdminDialogEvent, openAdminDialogEvent} from "../dialogs/model";
import {AdminDialogsEnum} from "../types";

getCommonTemplatesFx.use(handleGetCommonTemplates);
createTemplateFx.use(handleCreateCommonTemplate);
uploadTemplateFileFx.use(handleUploadCommonTemplateBackground);
getCommonTemplateFx.use(handleGetCommonTemplate);
deleteCommonTemplateFx.use(handleDeleteCommonTemplate);
updateCommonTemplateFx.use(handleUpdateCommonTemplate);
deleteCommonTemplateSoundFx.use(handleDeleteCommonTemplateSound);

$commonTemplates.on(getCommonTemplatesFx.doneData, (state, data) => data);

$commonTemplateStore
	.on(
		[
			createTemplateFx.doneData,
			uploadTemplateFileFx.doneData,
			getCommonTemplateFx.doneData,
		],
	(state, data) => data,
	)
	.on(updateCommonTemplateDataEvent, (state, data) => ({
		...state,
		state: ({ ...state.state, ...data }) as ICommonTemplate,
	}))
	.reset(deleteCommonTemplateFx.doneData);

$roomPreviewIdStore.on(setRoomPreviewIdEvent, (state, data) => data);

$roomPreviewIdStore.watch((state) => {
	if (state) {
		openAdminDialogEvent(AdminDialogsEnum.roomPreviewDialog);
	} else {
		closeAdminDialogEvent(AdminDialogsEnum.roomPreviewDialog);
	}
});

createTemplateFx.doneData.watch(data => {
	if (data.state?.id) {
		Router.push(`rooms/create/${data.state?.id}`);
	}
});


