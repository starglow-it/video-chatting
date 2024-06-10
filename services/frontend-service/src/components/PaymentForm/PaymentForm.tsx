import { memo, useCallback } from 'react';
import { useStore } from 'effector-react';

//hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

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
    updateUserSocketEvent,
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

const Component = ({ onClose, subLabel, payment, setMeetingPreviewShow }: PaymentFormProps) => {
    const paymentIntent = useStore($paymentIntent);
    const isCreatePaymentIntentPending = useStore(
        createPaymentIntentWithData.pending,
    );
    const { isMobile } = useBrowserDetect();

    const handleSubmit = useCallback(async () => {
        await onClose?.();
        addNotificationEvent({
            type: NotificationType.PaymentSuccess,
            message: 'payments.paymentSuccess',
            withSuccessIcon: true,
        });

        if (payment.type === PaymentType.Meeting) {
            updateUserSocketEvent({
                isDonated: true
            });
        }
    }, []);

    const handleSubmitError = useCallback(() => {
        addNotificationEvent({
            type: NotificationType.PaymentFail,
            message: 'payments.paymentFail',
            withErrorIcon: true,
        });
    }, []);

    const colorMain = isMobile ? 'white' : 'black';

    return (
        <CustomGrid container direction="column">
            <CustomGrid
                item
                container
                direction="column"
            >
                <CustomGrid
                    item
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
                            color: `${colorMain}`,
                        }}
                    >
                        {currencySigns[payment.currency]}
                        {payment.price}
                    </CustomTypography>
                    &nbsp;
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
                            variant="body1bold"
                            color={colorMain}
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
                                isPreEvent={false}
                                onSubmit={handleSubmit}
                                onError={handleSubmitError}
                                setMeetingPreviewShow={setMeetingPreviewShow}
                                paymentIntentSecret={paymentIntent.clientSecret}
                                colorForm={colorMain}
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
        </CustomGrid>
    );
};

export const PaymentForm = memo<PaymentFormProps>(Component);
