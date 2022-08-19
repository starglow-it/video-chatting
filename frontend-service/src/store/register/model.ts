import { RegisteredUserState, RegisterUserParams } from '../types';
import { rootDomain } from '../domains';

export const registerDomain = rootDomain.createDomain('registerDomain');

export const initialRegisterState: RegisteredUserState = {
    isUserRegistered: false,
    isUserConfirmed: false,
    error: null,
};

export const $registerStore = registerDomain.store<RegisteredUserState>(initialRegisterState);

export const resetRegisterErrorEvent = registerDomain.event('resetRegisterErrorEvent');

export const registerUserFx = registerDomain.effect<RegisterUserParams, RegisteredUserState>(
    'registerUserFx',
);

export const confirmRegistrationUserFx = registerDomain.effect<string, RegisteredUserState>(
    'confirmRegisterUserFx',
);
