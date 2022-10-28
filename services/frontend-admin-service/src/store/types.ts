import { TokenPair, ErrorState } from 'shared-types';

export type StateWithError<State> = {
    error: ErrorState | null | undefined;
    state: State;
};

export type AuthAdminState = StateWithError<{
    isAuthenticated: boolean;
    admin: unknown;
}>;

export type UsersStatisticsState = StateWithError<{
    users: [];
    totalNumber: number;
}>;

export type SubscriptionsStatisticsState = StateWithError<{
    subscriptions: {
        house: number,
        professional: number,
        business: number,
    };
    totalNumber: number;
}>;

export type LoginAdminPayload = {
    email: string;
    password: string;
};

export type LoginAdminResponse = { admin: AuthAdminState['state']['admin'] } & TokenPair;
export type SubscriptionsStatisticsResponse = SubscriptionsStatisticsState["state"];
export type UsersStatisticsResponse = UsersStatisticsState["state"];
export type CheckAdminResponse = AuthAdminState['state']['admin'];
