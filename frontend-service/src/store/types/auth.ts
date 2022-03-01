import { ErrorState } from './http';

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
