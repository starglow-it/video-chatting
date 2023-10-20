import { memo, useCallback, useState } from 'react';
import {
    CardNumberElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';

// custom
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// stripe
import { StripeIcon } from 'shared-frontend/icons/OtherIcons/StripeIcon';
import { StripeCardNumber } from '@components/Stripe/StripeCardNumber/StripeCardNumber';
import { StripeCardExpiry } from '@components/Stripe/StripeCardExpiry/StripeCardExpiry';
import { StripeCardCvc } from '@components/Stripe/StripeCardCvc/StripeCardCvc';
import clsx from 'clsx';
// styles
import { CardDataFormProps } from './types';

import styles from './CardDataForm.module.scss';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { PaymentType } from 'shared-const';

// types

const Component = ({
    onSubmit,
    onError,
    paymentIntentSecret,
    colorForm = 'white',
    paymentType,
}: CardDataFormProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = useCallback(
        async (event: { preventDefault: () => void }) => {
            event.preventDefault();
            console.log('submit card', event);

            if (stripe && elements) {
                setIsLoading(true);
                const result = await stripe.confirmCardPayment(
                    paymentIntentSecret,
                    {
                        payment_method: {
                            card: elements.getElement(CardNumberElement) ?? {
                                token: '',
                            },
                        },
                    },
                );
                console.log('#Duy Phan console', result)

                if (result.error) {
                    onError();
                    setIsLoading(false);
                } else {
                    onSubmit();
                    setIsLoading(false);
                }
            }
        },
        [stripe, elements],
    );

    const isFormBlack = colorForm === 'black';

    const renderFormMeeting = () => {
        return (
            <CustomGrid container gap={2}>
                <StripeCardNumber
                    className={clsx(styles.cardPaywallField, {
                        [styles.borderFieldBlack]: isFormBlack,
                    })}
                    colorForm={colorForm}
                    styleBase={{ height: '45px', fontSize: '14px', lineHeight: '45px' }}
                />
                <StripeCardExpiry
                    className={clsx(styles.datePaywallField, {
                        [styles.borderFieldBlack]: isFormBlack,
                    })}
                    colorForm={colorForm}
                    styleBase={{ height: '45px', fontSize: '14px', lineHeight: '45px' }}
                />
                <StripeCardCvc
                    className={clsx(styles.cvcPaywallField, {
                        [styles.borderFieldBlack]: isFormBlack,
                    })}
                    colorForm={colorForm}
                    styleBase={{ height: '45px', fontSize: '14px', lineHeight: '45px' }}
                />
            </CustomGrid>
        );
    };

    const renderFormPaywall = () => {
        return (
            <CustomGrid container gap={2}>
                <StripeCardNumber
                    className={clsx(styles.cardField, {
                        [styles.borderFieldBlack]: isFormBlack,
                    })}
                    colorForm={colorForm}
                />
                <StripeCardExpiry
                    className={clsx(styles.dateField, {
                        [styles.borderFieldBlack]: isFormBlack,
                    })}
                    colorForm={colorForm}
                />
                <StripeCardCvc
                    className={clsx(styles.cvcField, {
                        [styles.borderFieldBlack]: isFormBlack,
                    })}
                    colorForm={colorForm}
                />
            </CustomGrid>
        );
    };
    return (
        <form onSubmit={handleSubmit}>
            <ConditionalRender condition={paymentType === PaymentType.Meeting}>
                {renderFormMeeting()}
            </ConditionalRender>
            <ConditionalRender condition={paymentType === PaymentType.Paywall}>
                {renderFormPaywall()}
            </ConditionalRender>
            <CustomButton
                type="submit"
                variant="custom-common"
                Icon={<StripeIcon width="24px" height="24px" />}
                className={styles.button}
                isLoading={isLoading}
            >
                &nbsp;
                <CustomTypography
                    nameSpace="meeting"
                    translation="payments.payWith"
                />
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
