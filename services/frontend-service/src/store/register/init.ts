import { AppDialogsEnum } from '../types';
import { appDialogsApi } from '../dialogs/init';
import {
    $registerStore,
    confirmRegistrationUserFx,
    registerUserFx,
    resetRegisterErrorEvent,
} from './model';
import { handleRegisterUser } from './handlers/handleRegisterUser';
import { handleConfirmRegistration } from './handlers/handleConfirmRegistration';
import {StorageKeysEnum, WebStorage} from "../../controllers/WebStorageController";

registerUserFx.use(handleRegisterUser);
confirmRegistrationUserFx.use(handleConfirmRegistration);

$registerStore
    .on(resetRegisterErrorEvent, state => ({ ...state, error: null }))
    .on(registerUserFx.doneData, (_state, data) => data)
    .on(registerUserFx.failData, (state, error) => ({
        isUserRegistered: false,
        error: { message: error.message }
    }))
    .on(confirmRegistrationUserFx.doneData, (state, data) => ({
        ...state,
        ...data,
    }));

registerUserFx.doneData.watch((data) => {
    if (data.isUserRegistered) {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.isUserRegisteredDialog,
        });

        WebStorage.delete({ key: StorageKeysEnum.templateId });
    }
})
