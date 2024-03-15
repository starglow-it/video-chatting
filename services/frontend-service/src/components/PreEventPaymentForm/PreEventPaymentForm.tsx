import { memo, useCallback, useState, useEffect } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

// components
import { StripeElement } from '@components/Stripe/StripeElement/StripeElement';
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';
import { CardDataForm } from '@components/Payments/CardDataForm/CardDataForm';
import InputBase from '@mui/material/InputBase';

// stores
import { PaymentFormProps } from '@components/PaymentForm/types';
import { PaymentType } from 'shared-const';
import { addNotificationEvent } from '../../store';
import {
    $paymentIntent,
    $preEventPaymentCodeStore,
    $preEventPaymentCodeCheckStore,
    $localUserStore,
    createPaymentIntentWithData,
    updateUserSocketEvent
} from '../../store/roomStores';

// styles
import styles from './PreEventPaymentForm.module.scss';

// types
import { NotificationType } from '../../store/types';
import clsx from 'clsx';

const currencySigns: { [key: string]: string } = {
    USD: '$',
    CAD: 'C$',
    GBP: '£',
    EUR: '€',
    INR: '₹',
    AUS: 'A$',
};

const schema = yup.object().shape({
    email: yup.string().email(),
    code: yup.string().matches(/^[a-zA-Z0-9]{6}$/, 'Code must be exactly six letters'),
});

const Component = ({ isPaywallPaid, payment, setMeetingPreviewShow }: PaymentFormProps) => {
    const paymentIntent = useStore($paymentIntent);
    const preEventPaymentCode = useStore($preEventPaymentCodeStore);
    const preEventPaymentCodeCheck = useStore($preEventPaymentCodeCheckStore);
    const isCreatePaymentIntentPending = useStore(
        createPaymentIntentWithData.pending,
    );
    const localUser = useStore($localUserStore);
    const [isPrePaymentCompleted, setIsPrePaymentCompleted] = useState(false);
    const router = useRouter();
    const queryToken = router.query.token as string;

    const { register, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const codeValue = watch('code');

    useEffect(() => {
        if (preEventPaymentCodeCheck === 'success') {
            if (!localUser.isPaywallPaid) {
                updateUserSocketEvent({ isPaywallPaid: true });
            }
            setMeetingPreviewShow();
        }
    }, [preEventPaymentCodeCheck]);

    const handleSubmitResult = async () => {
        addNotificationEvent({
            type: NotificationType.PaymentSuccess,
            message: 'payments.paymentSuccess',
            withSuccessIcon: true,
        });

        setIsPrePaymentCompleted(true);
        setMeetingPreviewShow();
    };

    const handleSubmitError = useCallback(() => {
        addNotificationEvent({
            type: NotificationType.PaymentFail,
            message: 'payments.paymentFail',
            withErrorIcon: true,
        });
    }, []);

    const handleCopyCode = async () => {
        await navigator.clipboard.writeText(preEventPaymentCode.code);
        addNotificationEvent({
            type: NotificationType.copyNotification,
            message: 'meeting.copy.notification',
            withSuccessIcon: true,
        });
    };

    return (
        <CustomGrid container direction="column" className={clsx(styles.wrapper)}>
            <CustomGrid
                item
                container
                direction="column"
                className={clsx(styles.innerWrapper)}
            >
                <CustomTypography
                    nameSpace="createRoom"
                    translation="editDescription.form.prePaymentTitle"
                    className={styles.paymentTitle}
                />
                <ConditionalRender condition={!isPrePaymentCompleted}>
                    <CustomTypography variant="body1bold" className={styles.prePaymentSubTitile}>
                        Please pay the entry fee: &nbsp;
                        {currencySigns[payment.currency]}
                        {payment.price}
                    </CustomTypography>
                    <CustomTypography
                        variant="body1bold"
                        color='black'
                        nameSpace="meeting"
                        translation="payments.endterYourCode"
                        className={styles.titleCard}
                        sx={{
                            margin: "10px 0px"
                        }}
                    />
                    <InputBase
                        {...register('code')}
                        placeholder="Code"
                        fullWidth
                        error={preEventPaymentCodeCheck === 'fail'}
                        className={styles.codeInput}
                    />
                    {
                        preEventPaymentCodeCheck === 'fail' &&
                        <CustomTypography
                            nameSpace="meeting"
                            translation="payments.codeError"
                            className={styles.errorText}
                        />
                    }
                    {!isCreatePaymentIntentPending && paymentIntent.clientSecret ? (
                        <CustomGrid
                            container
                            direction="column"
                            className={styles.paymentForm}
                            sx={{
                                marginTop: {
                                    xs: '0px',
                                    sm: '0px',
                                    md: '0px',
                                    xl: '0px',
                                },
                            }}
                        >
                            <CustomTypography
                                variant="body1"
                                color='black'
                                nameSpace="meeting"
                                translation="payments.or"
                                className={styles.orText}
                            />
                            <CustomTypography
                                variant="body1bold"
                                color='black'
                                nameSpace="meeting"
                                translation="payments.prePayAndRegister"
                                className={styles.titleCard}
                                sx={{
                                    marginBottom: "10px",
                                }}
                            />
                            <StripeElement secret={paymentIntent.clientSecret}>
                                <CardDataForm
                                    isPreEvent={true}
                                    isError={errors.email}
                                    templateId={typeof queryToken !== undefined ? queryToken : ''}
                                    code={codeValue}
                                    isPaywallPaid={isPaywallPaid}
                                    onSubmit={handleSubmitResult}
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
                </ConditionalRender>
                <ConditionalRender condition={isPrePaymentCompleted}>
                    <CustomTypography
                        nameSpace="meeting"
                        translation="payments.registrationSubTitle"
                        className={styles.registrationSubTitle}
                    />
                    <CustomGrid
                        item
                        container
                        direction="column"
                        gap={1}
                        className={styles.yourEntryCodeWrapper}
                    >
                        <CustomGrid
                            item
                            container
                            justifyContent="center"
                            alignItems="center"
                            gap={1}
                        >
                            <CustomImage
                                src="/images/yourEntryCode.png"
                                width="25px"
                                height="25px"
                                alt="yourEntryCode"
                            />
                            <CustomTypography
                                nameSpace="meeting"
                                translation="payments.yourEntryCode"
                                className={styles.yourEntryCode}
                            />
                            <CustomTypography
                                className={clsx(styles.yourEntryCode, styles.isCopyEnabled)}
                                onClick={handleCopyCode}
                            >{preEventPaymentCode.code}</CustomTypography>
                        </CustomGrid>
                        <CustomTypography
                            nameSpace="meeting"
                            translation="payments.codeNotify"
                            className={styles.registrationSubTitle}
                        />
                    </CustomGrid>
                    <CustomGrid
                        item
                        container
                        alignItems="center"
                        direction="column"
                        className={styles.byEmailWrapper}
                    >
                        <CustomTypography
                            nameSpace="meeting"
                            translation="payments.byEmail"
                            className={styles.byEmail}
                        />
                        <CustomTypography
                            className={styles.byEmail}
                        >{preEventPaymentCode.email}</CustomTypography>
                    </CustomGrid>
                </ConditionalRender>
            </CustomGrid>
        </CustomGrid>
    );
};

export const PreEventPaymentForm = memo<PaymentFormProps>(Component);
