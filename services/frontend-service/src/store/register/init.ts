import { sample } from 'effector';
import { AppDialogsEnum, NotificationType } from '../types';
import { appDialogsApi } from '../dialogs/init';
import {
    $registerStore,
    confirmRegistrationUserFx,
    registerUserFx,
    registerWithoutTemplateFx,
    resetRegisterErrorEvent,
} from './model';
import { handleRegisterUser } from './handlers/handleRegisterUser';
import { handleConfirmRegistration } from './handlers/handleConfirmRegistration';
import {
    StorageKeysEnum,
    WebStorage,
} from '../../controllers/WebStorageController';
import { handleRegisterWithoutTemplate } from './handlers/handleRegisterWithoutTemplate';
import { loginUserFx } from '../auth/model';
import { addNotificationEvent } from '../notifications/model';

registerUserFx.use(handleRegisterUser);
confirmRegistrationUserFx.use(handleConfirmRegistration);
registerWithoutTemplateFx.use(handleRegisterWithoutTemplate);

$registerStore
    .on(resetRegisterErrorEvent, state => ({ ...state, error: null }))
    .on(registerUserFx.doneData, (_state, data) => data)
    .on(registerUserFx.failData, (state, error) => ({
        isUserRegistered: false,
        error: { message: error.message },
    }))
    .on(confirmRegistrationUserFx.doneData, (state, data) => ({
        ...state,
        ...data,
    }));

registerUserFx.doneData.watch(data => {
    if (data.isUserRegistered) {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.isUserRegisteredDialog,
        });

        WebStorage.delete({ key: StorageKeysEnum.templateId });
    }
});

sample({
    clock: registerWithoutTemplateFx.doneData,
    filter: ({ error }) => !!error,
    fn: (_, clock: any) => ({
        message: clock?.error.message,
        type: NotificationType.validationError,
        withErrorIcon: true,
    }),
    target: addNotificationEvent,
});

sample({
    clock: registerWithoutTemplateFx.doneData,
    filter: ({ error }) => !error,
    fn: (_, clock) => ({ email: clock.email, password: clock.password }),
    target: loginUserFx,
});
