import { memo, useCallback } from 'react';
import { useStore } from 'effector-react';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomDivider } from 'shared-frontend/library/custom/CustomDivider';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import { StripeElement } from '@components/Stripe/StripeElement/StripeElement';
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';
import { CardDataForm } from '@components/Payments/CardDataForm/CardDataForm';

// stores
import { PaymentFormProps } from '@components/PaymentForm/types';
import { PaymentType } from 'shared-const';
import { addNotificationEvent } from '../../store';
import {
    $paymentIntent,
    createPaymentIntentWithData,
    updateUserSocketEvent
} from '../../store/roomStores';

// styles
import styles from './PaymentForm.module.scss';

// types
import { NotificationType } from '../../store/types';

const currencySigns: { [key: string]: string } = {
    USD: '$',
    CAD: 'C$',
    GBP: '£',
    EUR: '€',
    INR: '₹',
    AUS: 'A$',
};

const Component = ({ isPreEvent = false, onClose, subLabel, payment, setMeetingPreviewShow }: PaymentFormProps) => {
    const paymentIntent = useStore($paymentIntent);
    const isCreatePaymentIntentPending = useStore(
        createPaymentIntentWithData.pending,
    );

    const handleSubmit = useCallback(async () => {
        onClose?.();
        addNotificationEvent({
            type: NotificationType.PaymentSuccess,
            message: 'payments.paymentSuccess',
            withSuccessIcon: true,
        });
        updateUserSocketEvent({ isDonated: true });
    }, []);

    const handleSubmitError = useCallback(() => {
        addNotificationEvent({
            type: NotificationType.PaymentFail,
            message: 'payments.paymentFail',
            withErrorIcon: true,
        });
    }, []);

    const colorMain = `colors.${payment.type === PaymentType.Paywall ? 'black' : 'white'}.primary`;

    return (
        <CustomGrid container direction="column">
            <CustomGrid
                container
                alignItems="center"
                sx={{
                    marginBottom: {
                        xs: '20px',
                        sm: '10px',
                        md: '20px',
                        xl: '20px',
                    },
                }}
                className={styles.title}
            >
                {subLabel ? <>{subLabel} </> : null}
                &nbsp;
                <CustomTypography
                    sx={{
                        color: `rgba(${colorMain}, 0.6)`,
                    }}
                >
                    {currencySigns[payment.currency]}
                    {payment.price}
                </CustomTypography>
                &nbsp;
                <CustomTypography
                    sx={{
                        color: `rgba(${colorMain}, 0.6)`,
                    }}
                >
                    &#8226;
                </CustomTypography>
                &nbsp;
                <CustomTypography
                    variant={isPreEvent ? 'body3' : 'h4'}
                    nameSpace="meeting"
                    translation="payments.perSession"
                    sx={{
                        color: `rgba(${colorMain}, 0.6)`,
                    }}
                />
            </CustomGrid>
            <CustomDivider light flexItem />
            {!isCreatePaymentIntentPending && paymentIntent.clientSecret ? (
                <CustomGrid
                    container
                    direction="column"
                    className={styles.paymentForm}
                    sx={{
                        marginTop: {
                            xs: '20px',
                            sm: '10px',
                            md: '20px',
                            xl: '20px',
                        },
                    }}
                >
                    <CustomTypography
                        variant={isPreEvent ? "body3bold" : "body1bold"}
                        color={isPreEvent ? 'black' : colorMain}
                        nameSpace="meeting"
                        translation="payments.yourCard"
                        className={styles.titleCard}
                        sx={{
                            marginBottom: {
                                xs: '20px',
                                sm: '10px',
                                md: '20px',
                                xl: '20px',
                            },
                        }}
                    />
                    <StripeElement secret={paymentIntent.clientSecret}>
                        <CardDataForm
                            isPreEvent={isPreEvent}
                            onSubmit={handleSubmit}
                            onError={handleSubmitError}
                            setMeetingPreviewShow={setMeetingPreviewShow}
                            paymentIntentSecret={paymentIntent.clientSecret}
                            colorForm={
                                payment.type === PaymentType.Paywall
                                    ? 'black'
                                    : 'white'
                            }
                            paymentType={payment.type}
                        />
                    </StripeElement>
                </CustomGrid>
            ) : (
                <CustomGrid
                    container
                    justifyContent="center"
                    alignItems="center"
                    className={styles.loader}
                >
                    <CustomLoader />
                </CustomGrid>
            )}
        </CustomGrid>
    );
};

export const PaymentForm = memo<PaymentFormProps>(Component);
