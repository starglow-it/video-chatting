import { INextPageContext } from '../../types';

export type GetSubscriptionPayload = {
    subscriptionId: string;
} & Partial<INextPageContext>;
