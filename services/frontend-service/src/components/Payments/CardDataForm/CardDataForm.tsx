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
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { PaymentType } from 'shared-const';

import { useStore } from 'effector-react';
import { $isPortraitLayout } from 'src/store';
import { isMobile } from 'shared-utils';
import styles from './CardDataForm.module.scss';
import { CardDataFormProps } from './types';

// types

const Component = ({
    isPreEvent = false,
    onSubmit,
    onError,
    setMeetingPreviewShow = () => {},
    paymentIntentSecret,
    colorForm = 'white',
    paymentType,
}: CardDataFormProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const isPortraitLayout = useStore($isPortraitLayout);

    const handleSubmit = useCallback(
        async (event: { preventDefault: () => void }) => {
            event.preventDefault();

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

                if (result.error) {
                    onError();
                    setIsLoading(false);
                } else {
                    onSubmit();
                    setIsLoading(false);
                    setMeetingPreviewShow();
                }
            }
        },
        [stripe, elements],
    );

    const isFormBlack = colorForm === 'black';

    const renderFormMeeting = () => {
        return (
            <CustomGrid
                container
                gap={isMobile() ? 1 : 2}
                flexDirection="column"
            >
                <CustomGrid
                    display="flex"
                    flexDirection="column"
                    flex={1}
                    width={isMobile() && !isPortraitLayout || isPreEvent ? '100%' : '300px'}
                >
                    {
                        !isPreEvent &&
                        <CustomTypography className={styles.textField}>
                            Card number
                        </CustomTypography>
                    }
                    <StripeCardNumber
                        className={clsx(styles.cardPaywallField, {
                            [styles.isPreEvent]: isPreEvent,
                            [styles.borderFieldBlack]: isFormBlack,
                        })}
                        colorForm={colorForm}
                        styleBase={{
                            width:
                                isMobile() && !isPortraitLayout
                                    ? '100%'
                                    : '300px',
                            height: '42px',
                            fontSize: '13px',
                            lineHeight: '42px',
                        }}
                    />
                </CustomGrid>
                <CustomGrid display="flex" flexDirection="row" gap={1}>
                    <CustomGrid display="flex" flexDirection="column" flex={1}>
                        {
                            !isPreEvent &&
                            <CustomTypography className={styles.textField}>
                                Expired date
                            </CustomTypography>
                        }
                        <StripeCardExpiry
                            className={clsx(styles.datePaywallField, {
                                [styles.isPreEvent]: isPreEvent,
                                [styles.borderFieldBlack]: isFormBlack,
                            })}
                            colorForm={colorForm}
                            styleBase={{
                                height: '42px',
                                fontSize: '13px',
                                lineHeight: '42px',
                            }}
                        />
                    </CustomGrid>
                    <CustomGrid flex={1} display="flex" flexDirection="column">
                        {!isPreEvent &&
                            <CustomTypography className={styles.textField}>
                                CVC
                            </CustomTypography>
                        }
                        <StripeCardCvc
                            className={clsx(styles.cvcPaywallField, {
                                [styles.isPreEvent]: isPreEvent,
                                [styles.borderFieldBlack]: isFormBlack,
                            })}
                            colorForm={colorForm}
                            styleBase={{
                                height: '42px',
                                fontSize: '13px',
                                lineHeight: '42px',
                            }}
                        />
                    </CustomGrid>
                </CustomGrid>
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
                className={clsx(styles.button, {
                    [styles.isPreEvent]: isPreEvent,
                    [styles.paddingButton]: paymentType === PaymentType.Meeting,
                    [styles.mobile]: isMobile() && !isPortraitLayout,
                })}
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
