import React, { memo } from 'react';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';

import getConfig from 'next/config';

import { StripeElementProps } from '@components/Stripe/StripeElement/types';

const { publicRuntimeConfig } = getConfig();

const stripePromise = loadStripe(publicRuntimeConfig.stripePublicKey);

const Component = ({
    secret,
    children,
}: React.PropsWithChildren<StripeElementProps>) => {
    const options = {
        clientSecret: secret,
        locale: 'en',
        fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=Poppins' }],
        appearance: {
            colorTextPlaceholder: 'rgba(white, 0.6)',
        },
    } as StripeElementsOptions;

    return (
        <Elements stripe={stripePromise} options={options}>
            {children}
        </Elements>
    );
};

export const StripeElement = memo(Component);
