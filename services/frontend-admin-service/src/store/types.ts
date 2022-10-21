import { TokenPair, ErrorState } from 'shared-types';

export type StateWithError<State> = {
    error: ErrorState | null;
    state: State;
};

export type AuthAdminState = StateWithError<{
    isAuthenticated: boolean;
    admin: unknown;
}>;

export type LoginAdminPayload = {
    email: string;
    password: string;
};

export type LoginAdminResponse = { admin: AuthAdminState['state']['admin'] } & TokenPair;
export type CheckAdminResponse = AuthAdminState['state']['admin'];
