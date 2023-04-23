import React, { memo, useCallback } from 'react';
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';

// custom
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// stripe
import { StripeIcon } from 'shared-frontend/icons/OtherIcons/StripeIcon';
import { StripeCardNumber } from '@components/Stripe/StripeCardNumber/StripeCardNumber';
import { StripeCardExpiry } from '@components/Stripe/StripeCardExpiry/StripeCardExpiry';
import { StripeCardCvc } from '@components/Stripe/StripeCardCvc/StripeCardCvc';

// styles
import { CardDataFormProps } from './types';

import styles from './CardDataForm.module.scss';

// types

const Component = ({ onSubmit, onError, paymentIntentSecret }: CardDataFormProps) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = useCallback(
        async event => {
            event.preventDefault();
            console.log('submit card', event);

            if (stripe && elements) {
                const result = await stripe.confirmCardPayment(paymentIntentSecret, {
                    payment_method: {
                        card: elements.getElement(CardNumberElement),
                    },
                });

                if (result.error) {
                    onError();
                } else {
                    onSubmit();
                }
            }
        },
        [stripe, elements],
    );

    return (
        <form onSubmit={handleSubmit}>
            <CustomGrid container gap={2}>
                <StripeCardNumber className={styles.cardField} />
                <StripeCardExpiry className={styles.dateField} />
                <StripeCardCvc className={styles.cvcField} />
            </CustomGrid>
            <CustomButton
                type="submit"
                variant="custom-common"
                Icon={<StripeIcon width="24px" height="24px" />}
                className={styles.button}
            >
                &nbsp;
                <CustomTypography nameSpace="meeting" translation="payments.payWith" />
                &nbsp;
                <CustomTypography
                    variant="body1bold"
                    nameSpace="meeting"
                    translation="payments.stripe"
                />
            </CustomButton>
        </form>
    );
};

export const CardDataForm = memo(Component);
