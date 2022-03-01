import { root } from '../root';
import { RegisteredUserState, RegisterUserParams } from '../types';

export const registerDomain = root.createDomain('registerDomain');

export const initialRegisterState: RegisteredUserState = {
    isUserRegistered: false,
    isUserConfirmed: false,
};

export const $registerStore = registerDomain.store<RegisteredUserState>(initialRegisterState);

export const registerUserFx = registerDomain.effect<RegisterUserParams, RegisteredUserState>(
    'registerUserFx',
);

export const confirmRegistrationUserFx = registerDomain.effect<string, RegisteredUserState>(
    'confirmRegisterUserFx',
);

export const resetRegisterErrorEvent = registerDomain.event('resetRegisterErrorEvent');
