export type GetCheckoutSessionUrlPayload = {
    productId: string;
    meetingToken?: string;
    baseUrl?: string;
    cancelUrl?: string;
    withTrial?: boolean;
};

export type GetPortalSessionUrlPayload = { subscriptionId: string };

export type GetCheckoutSessionUrlResponse = { url: string } | undefined;
export type GetPortalSessionUrlResponse = { url: string } | undefined;

export type ProductsStore = { product: unknown; price: unknown }[];
