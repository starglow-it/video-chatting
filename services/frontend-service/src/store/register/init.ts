import { sample } from 'effector';
import { AppDialogsEnum, NotificationType } from '../types';
import { appDialogsApi } from '../dialogs/init';
import {
    $registerStore,
    confirmRegistrationUserFx,
    registerUserFx,
    seatRegisterUserFx,
    registerWithoutTemplateFx,
    resetRegisterErrorEvent,
} from './model';
import { handleRegisterUser } from './handlers/handleRegisterUser';
import { handleSeatRegisterUser } from './handlers/handleSeatRegisterUser';
import { handleConfirmRegistration } from './handlers/handleConfirmRegistration';
import {
    StorageKeysEnum,
    WebStorage,
} from '../../controllers/WebStorageController';
import { handleRegisterWithoutTemplate } from './handlers/handleRegisterWithoutTemplate';
import { loginUserFx } from '../auth/model';
import { addNotificationEvent } from '../notifications/model';

seatRegisterUserFx.use(handleSeatRegisterUser);
registerUserFx.use(handleRegisterUser);
confirmRegistrationUserFx.use(handleConfirmRegistration);
registerWithoutTemplateFx.use(handleRegisterWithoutTemplate);

$registerStore
    .on(resetRegisterErrorEvent, state => ({ ...state, error: null }))
    .on([registerUserFx.doneData, seatRegisterUserFx.doneData], (_state, data) => {
        if (!localStorage.getItem("isFirstDashboardVisit")) {
            localStorage.setItem("isFirstDashboardVisit", "true");
        }

        if (!localStorage.getItem("isFirstMeeting")) {
            localStorage.setItem("isFirstMeeting", "true");
        }

        return data;
    })
    .on([registerUserFx.failData, seatRegisterUserFx.failData], (state, error) => ({
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

seatRegisterUserFx.doneData.watch(data => {
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
