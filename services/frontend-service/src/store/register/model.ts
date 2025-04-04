import { RegisteredUserState, RegisterUserParams, SeatRegisterUserParams } from '../types';
import { rootDomain } from '../domains';

export const registerDomain = rootDomain.createDomain('registerDomain');

export const initialRegisterState: RegisteredUserState = {
    isUserRegistered: false,
    isUserConfirmed: false,
    error: null,
};

export const $registerStore =
    registerDomain.createStore<RegisteredUserState>(initialRegisterState);

export const resetRegisterErrorEvent = registerDomain.event(
    'resetRegisterErrorEvent',
);

export const registerUserFx = registerDomain.effect<
    RegisterUserParams,
    RegisteredUserState
>('registerUserFx');

export const seatRegisterUserFx = registerDomain.effect<
    SeatRegisterUserParams,
    RegisteredUserState
>('seatRegisterUserFx');

export const confirmRegistrationUserFx = registerDomain.effect<
    string,
    RegisteredUserState
>('confirmRegisterUserFx');

export const registerWithoutTemplateFx = registerDomain.createEffect<
    RegisterUserParams,
    RegisteredUserState
>('registerWithoutTemplateFx');
