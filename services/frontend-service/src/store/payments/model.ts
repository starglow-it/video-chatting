import { paymentsDomain } from '../domains';

import { ErrorState } from '../types';
import { ConnectStripeAccountResponse, LoginStripeAccountResponse } from './types';

export const connectStripeAccountFx = paymentsDomain.createEffect<
    void,
    ConnectStripeAccountResponse,
    ErrorState
>('connectStripeAccount');
export const loginStripeAccountFx = paymentsDomain.effect<
    void,
    LoginStripeAccountResponse,
    ErrorState
>('loginStripeAccountFx');
export const deleteStripeAccountFx = paymentsDomain.effect<void, void, ErrorState>(
    'deleteStripeAccountFx',
);
