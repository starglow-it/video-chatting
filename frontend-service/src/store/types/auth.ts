import { ErrorState, TokenPair } from './http';
import { Profile } from './profile';

export type AuthUserState = {
    isAuthenticated: boolean;
    error?: ErrorState;
    user?: any;
};

export type LoginUserParams = {
    email: string;
    password: string;
};

export type RegisteredUserState = {
    isUserRegistered?: boolean;
    isUserConfirmed?: boolean;
    error?: ErrorState;
};

export type RegisterUserParams = {
    email: string;
    password: string;
};

export type LoginUserResponse = { user: Profile } & TokenPair;
export type LoginUserPayload = { email: string; password: string };
