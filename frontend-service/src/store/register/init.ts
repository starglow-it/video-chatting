import { AppDialogsEnum, RegisteredUserState } from '../types';
import { appDialogsApi } from '../dialogs/init';
import {
    $registerStore,
    confirmRegistrationUserFx,
    registerUserFx,
    resetRegisterErrorEvent,
} from './model';
import { handleRegisterUser } from './handlers/handleRegisterUser';
import { handleConfirmRegistration } from './handlers/handleConfirmRegistration';

registerUserFx.use(handleRegisterUser);
confirmRegistrationUserFx.use(handleConfirmRegistration);

$registerStore
    .on(resetRegisterErrorEvent, state => ({ ...state, error: null }))
    .on<RegisteredUserState>(registerUserFx.doneData, (_state, data) => {
        if (data.isUserRegistered) {
            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.isUserRegisteredDialog,
            });
        }

        return data;
    })
    .on(confirmRegistrationUserFx.doneData, (state, data) => ({
        ...state,
        ...data,
    }));
