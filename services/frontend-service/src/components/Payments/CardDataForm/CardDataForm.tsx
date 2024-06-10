import { memo, useCallback, useState } from 'react';
import {
    CardNumberElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// custom
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import InputBase from '@mui/material/InputBase';
import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';

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
import { generatePrePaymentCodeEvent, checkPrePaymentCodeEvent } from 'src/store/roomStores';

const schema = yup.object().shape({
    email: yup.string().email(),
});

// types

const Component = ({
    isPreEvent = false,
    isError = false,
    templateId,
    code,
    isPaywallPaid,
    onSubmit,
    onError,
    setMeetingPreviewShow = () => { },
    paymentIntentSecret,
    colorForm = 'white',
    paymentType,
}: CardDataFormProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const isPortraitLayout = useStore($isPortraitLayout);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmitCodeByEmail = async (data: any) => {
        generatePrePaymentCodeEvent({ email: data.email, templateId });
    };

    const handleSubmitForm = useCallback(
        async (event: { preventDefault: () => void }) => {
            event.preventDefault();

            if (isPaywallPaid) {
                addNotificationEvent({
                    type: NotificationType.RequestRecordingMeeting,
                    message: "alreadyPaid",
                    withSuccessIcon: true
                });
            } else {
                if (stripe && elements && !errors.email) {
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

                    if (result?.error) {
                        onError();
                        setIsLoading(false);
                    } else {
                        setIsLoading(false);
                        if (isPreEvent) {
                            await handleSubmit(onSubmitCodeByEmail)();
                        }
                        onSubmit();
                    }
                }
            }
        },
        [stripe, elements, errors],
    );

    const handleCheckCode = (code: string) => {
        if (isPaywallPaid) {
            checkPrePaymentCodeEvent({ code });
        } else {
            addNotificationEvent({
                type: NotificationType.RequestRecordingMeeting,
                message: "notPaid",
                withErrorIcon: true
            });
        }
    };

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
                        <CustomTypography className={clsx(styles.textField, { [styles.mobile]: isMobile })}>
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
                            <CustomTypography className={clsx(styles.textField, { [styles.mobile]: isMobile })}>
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
                            <CustomTypography className={clsx(styles.textField, { [styles.mobile]: isMobile })}>
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
                {
                    isPreEvent &&
                    <CustomBox sx={{ width: '100%' }}>
                        <InputBase
                            {...register('email')}
                            placeholder="Email to send your entry Code"
                            fullWidth
                            className={clsx(styles.codeInput, styles.emailInput, { [styles.error]: errors.email })}
                        />
                        {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
                    </CustomBox>
                }
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
        <form onSubmit={handleSubmitForm}>
            <ConditionalRender condition={paymentType === PaymentType.Meeting}>
                {renderFormMeeting()}
            </ConditionalRender>
            <ConditionalRender condition={paymentType === PaymentType.Paywall}>
                {renderFormPaywall()}
            </ConditionalRender>
            <ConditionalRender condition={Boolean(code)}>
                <CustomButton
                    variant="custom-common"
                    Icon={<StripeIcon width="24px" height="24px" />}
                    className={clsx(styles.button, {
                        [styles.isPreEvent]: isPreEvent,
                        [styles.paddingButton]: paymentType === PaymentType.Meeting,
                        [styles.mobile]: isMobile() && !isPortraitLayout,
                    })}
                    isLoading={isLoading}
                    onClick={() => handleCheckCode(code)}
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
            </ConditionalRender>
            <ConditionalRender condition={!Boolean(code)}>
                <CustomButton
                    type="submit"
                    variant="custom-common"
                    Icon={<StripeIcon width="24px" height="24px" />}
                    className={clsx(styles.button, {
                        [styles.isPreEvent]: isPreEvent,
                        [styles.paddingButton]: paymentType === PaymentType.Meeting,
                        [styles.mobile]: isMobile() && !isPortraitLayout,
                        [styles.disabled]: errors.email
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
            </ConditionalRender>
        </form>
    );
};

export const CardDataForm = memo(Component);
