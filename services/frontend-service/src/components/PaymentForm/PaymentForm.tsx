import React, { memo, useCallback } from 'react';
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
import { addNotificationEvent } from '../../store';
import {
    $meetingTemplateStore,
    $paymentIntent,
    createPaymentIntentWithData,
} from '../../store/roomStores';

// styles
import styles from './PaymentForm.module.scss';

// types
import { NotificationType } from '../../store/types';

const currencySigns = {
    USD: '$',
    CAD: 'C$',
};

const Component = ({ onClose, templateType = 'white' }: PaymentFormProps) => {
    const meetingTemplate = useStore($meetingTemplateStore);
    const paymentIntent = useStore($paymentIntent);
    const isCreatePaymentIntentPending = useStore(createPaymentIntentWithData.pending);

    const handleSubmit = useCallback(async () => {
        onClose?.();
        addNotificationEvent({
            type: NotificationType.PaymentSuccess,
            message: 'payments.paymentSuccess',
            withSuccessIcon: true,
        });
    }, []);

    const handleSubmitError = useCallback(() => {
        addNotificationEvent({
            type: NotificationType.PaymentFail,
            message: 'payments.paymentFail',
            withErrorIcon: true,
        });
    }, []);

    const colorMain = `colors.${templateType}.primary`
    return (
        <CustomGrid container direction="column">
            <CustomGrid container className={styles.title} alignItems="center">
                <CustomTypography variant="h3bold" color={colorMain}>
                    {currencySigns[meetingTemplate.templateCurrency]}
                    {meetingTemplate.templatePrice}
                </CustomTypography>
                &nbsp;
                <CustomTypography className={styles.transparentWhite}>&#8226;</CustomTypography>
                &nbsp;
                <CustomTypography
                    className={styles.transparentWhite}
                    nameSpace="meeting"
                    translation="payments.perSession"
                />
            </CustomGrid>
            <CustomDivider light flexItem />
            {(!isCreatePaymentIntentPending && paymentIntent.clientSecret) ? (
                <CustomGrid container direction="column" className={styles.paymentForm}>
                    <CustomTypography
                        variant="body1bold"
                        color={colorMain}
                        nameSpace="meeting"
                        translation="payments.yourCard"
                        className={styles.title}
                    />
                    <StripeElement secret={paymentIntent.clientSecret}>
                        <CardDataForm
                            onSubmit={handleSubmit}
                            onError={handleSubmitError}
                            paymentIntentSecret={paymentIntent.clientSecret}
                            colorForm={templateType}
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
