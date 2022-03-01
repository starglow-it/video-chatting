import { sendRequest } from '../../helpers/http/sendRequest';
import { AppDialogsEnum, ErrorState, HttpMethods, RegisteredUserState } from '../types';
import { confirmRegisterUserUrl, registerUserUrl } from '../../utils/urls/resolveUrl';
import { appDialogsApi } from '../dialogs';
import {
    $registerStore,
    confirmRegistrationUserFx,
    registerUserFx,
    resetRegisterErrorEvent,
} from './model';

registerUserFx.use(async params => {
    const response = await sendRequest<void, ErrorState>(registerUserUrl, {
        method: HttpMethods.Post,
        data: params,
    });

    if (response.success) {
        return {
            isUserRegistered: response.success,
        };
    } else {
        return {
            isUserRegistered: response.success,
            error: response.error,
        };
    }
});

confirmRegistrationUserFx.use(async (token: string) => {
    const response = await sendRequest<void, ErrorState>(confirmRegisterUserUrl, {
        method: HttpMethods.Post,
        data: { token },
    });

    if (response.success) {
        return {
            isUserConfirmed: response?.success,
        };
    } else {
        return {
            isUserConfirmed: response?.success,
            error: response.error,
        };
    }
});

$registerStore
    .on(resetRegisterErrorEvent, ({ error, ...rest }) => ({
        ...rest,
    }))
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
