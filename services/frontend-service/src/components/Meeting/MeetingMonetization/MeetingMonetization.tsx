import { memo, useCallback, useMemo, useRef } from 'react';
import {
    FormProvider,
    Controller,
    useForm,
    useWatch,
    FieldValues,
} from 'react-hook-form';
import { InputBase } from '@mui/material';
import * as yup from 'yup';
import { useStore } from 'effector-react';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';

// icons
import { MonetizationIcon } from 'shared-frontend/icons/OtherIcons/MonetizationIcon';

// custom
import { CustomSwitch } from '@library/custom/CustomSwitch/CustomSwitch';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// common
import { ValuesSwitcher } from 'shared-frontend/library/common/ValuesSwitcher';

// validation
import { Translation } from '@library/common/Translation/Translation';
import { ErrorMessage } from '@library/common/ErrorMessage/ErrorMessage';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { ValuesSwitcherItem } from 'shared-frontend/types';
import {
    templatePriceSchema,
    paywallPriceSchema,
} from '../../../validation/payments/templatePrice';
import { booleanSchema, simpleStringSchema } from '../../../validation/common';

// styles
import styles from './MeetingMonetization.module.scss';

// stores
import { $profileStore } from '../../../store';
import {
    $meetingTemplateStore,
    updateMeetingTemplateFxWithData,
} from '../../../store/roomStores';

// const
import { currencyValues } from '../../../const/profile/subscriptions';
import { MeetingConnectStripe } from '../MeetingConnectStripe/MeetingConnectStripe';

const validationSchema = yup.object({
    templatePrice: templatePriceSchema(),
    paywallPrice: paywallPriceSchema(),
    isMonetizationEnabled: booleanSchema().required('required'),
    templateCurrency: simpleStringSchema().required('required'),
});

const Component = ({ onUpdate }: { onUpdate: () => void }) => {
    const buttonSaveRef = useRef<HTMLButtonElement | null>(null);
    const meetingTemplate = useStore($meetingTemplateStore);
    const profile = useStore($profileStore);
    const resolver = useYupValidationResolver<FieldValues>(validationSchema);

    const isConnectStripe = Boolean(
        profile.isStripeEnabled && profile.stripeAccountId,
    );

    const methods = useForm({
        criteriaMode: 'all',
        resolver,
        defaultValues: {
            isInmeetingPayment: Boolean(meetingTemplate.templatePrice),
            isPaywallPayment: Boolean(meetingTemplate.paywallPrice),
            isMonetizationEnabled: isConnectStripe
                ? Boolean(meetingTemplate.isMonetizationEnabled)
                : false,
            templatePrice: meetingTemplate.templatePrice || 5,
            paywallPrice: meetingTemplate.paywallPrice || 5,
            templateCurrency: meetingTemplate.templateCurrency || 'USD',
            paywallCurrency: meetingTemplate.templateCurrency || 'USD',
        },
    });

    const {
        register,
        setValue,
        control,
        handleSubmit,
        formState: { errors },
    } = methods;

    const handleValueChanged = useCallback(
        (
            newValue: ValuesSwitcherItem<'USD' | 'CAD', string>,
            type: 'templateCurrency' | 'paywallCurrency',
        ) => {
            setValue(type, newValue.value);
        },
        [],
    );

    const isInmeetingPaymentEnabled = useWatch({
        control,
        name: 'isInmeetingPayment',
    });

    const isPaywallPaymentEnabled = useWatch({
        control,
        name: 'isPaywallPayment',
    });

    const activeTemplateCurrency = useWatch({
        control,
        name: 'templateCurrency',
    });

    const targetTemplateCurrency = useMemo(
        () =>
            currencyValues.find(
                currency => currency.value === activeTemplateCurrency,
            ) || currencyValues[0],
        [activeTemplateCurrency],
    );

    const activePaywallCurrency = useWatch({
        control,
        name: 'paywallCurrency',
    });

    const targetPaywallCurrency = useMemo(
        () =>
            currencyValues.find(
                currency => currency.value === activePaywallCurrency,
            ) || currencyValues[0],
        [activePaywallCurrency],
    );

    const onSubmit = useCallback(
        handleSubmit(async data => {
            await updateMeetingTemplateFxWithData({
                isMonetizationEnabled:
                    data.isInmeetingPayment || data.isPaywallPayment,
                templatePrice: data.isInmeetingPayment
                    ? +data.templatePrice
                    : 0,
                paywallPrice: data.isPaywallPayment ? +data.paywallPrice : 0,
                templateCurrency: data.isInmeetingPayment
                    ? data.templateCurrency
                    : undefined,
                paywallCurrency: data.isPaywallPayment
                    ? data.paywallCurrency
                    : undefined,
            });
            onUpdate?.();
        }),
        [],
    );

    const handleFocusInput = () => {
        buttonSaveRef.current?.classList.add(styles.animate);
    };

    const handleEndAnimation = () => {
        buttonSaveRef.current?.classList.remove(styles.animate);
    };

    const registerData = register('templatePrice');
    const registerPaywallData = register('paywallPrice');

    const templatePriceMessage = ['min', 'max'].includes(
        errors?.templatePrice?.type?.toString() ?? '',
    )
        ? errors?.templatePrice?.message?.toString() ?? ''
        : '';
    const paywallPriceMessage = ['min', 'max'].includes(
        errors?.paywallPrice?.type?.toString() ?? '',
    )
        ? errors?.paywallPrice?.message?.toString() ?? ''
        : '';

    return (
        <>
            <CustomGrid
                container
                columnGap={4}
                direction="row"
                alignItems="center"
                marginBottom={2}
            >
                <CustomGrid
                    display="flex"
                    alignItems="center"
                    color="colors.white.primary"
                >
                    <MonetizationIcon width="24px" height="24px" />
                    <CustomTypography
                        translation="features.monetization"
                        nameSpace="meeting"
                    />
                </CustomGrid>
                <CustomBox style={{ flex: 1 }}>
                    <MeetingConnectStripe />
                </CustomBox>
            </CustomGrid>
            <FormProvider {...methods}>
                <form onSubmit={onSubmit}>
                    <CustomGrid
                        container
                        direction="column"
                        wrap="nowrap"
                        gap={2}
                    >
                        <CustomGrid
                            container
                            direction="column"
                            wrap="nowrap"
                            gap={2}
                            className={styles.wrapperForm}
                        >
                            <CustomGrid
                                container
                                wrap="nowrap"
                                className={styles.monetization}
                                gap={2}
                            >
                                <CustomGrid container flex={1}>
                                    <CustomTypography
                                        translation="features.inMeeting"
                                        nameSpace="meeting"
                                    />
                                    <CustomGrid
                                        container
                                        className={styles.amountInput}
                                        wrap="nowrap"
                                        justifyContent="space-between"
                                    >
                                        <InputBase
                                            type="number"
                                            placeholder="Amount"
                                            inputProps={{
                                                'aria-label': 'amount',
                                            }}
                                            classes={{
                                                root: styles.inputWrapper,
                                                input: styles.input,
                                            }}
                                            {...registerData}
                                            onFocus={handleFocusInput}
                                            disabled={
                                                !isInmeetingPaymentEnabled ||
                                                !isConnectStripe
                                            }
                                        />
                                        <ValuesSwitcher
                                            values={currencyValues}
                                            activeValue={targetTemplateCurrency}
                                            onValueChanged={value =>
                                                handleValueChanged(
                                                    value,
                                                    'templateCurrency',
                                                )
                                            }
                                            className={styles.switcher}
                                        />
                                    </CustomGrid>
                                    <ErrorMessage
                                        error={templatePriceMessage}
                                        className={styles.error}
                                    />
                                </CustomGrid>
                                <CustomBox marginTop={4.5}>
                                    <Controller
                                        control={control}
                                        name="isInmeetingPayment"
                                        render={({
                                            field: {
                                                onChange,
                                                value,
                                                name,
                                                ref,
                                            },
                                        }) => (
                                            <CustomSwitch
                                                name={name}
                                                onChange={onChange}
                                                checked={value}
                                                inputRef={ref}
                                                disabled={!isConnectStripe}
                                            />
                                        )}
                                    />
                                </CustomBox>
                            </CustomGrid>
                            <CustomGrid
                                container
                                wrap="nowrap"
                                className={styles.monetization}
                                gap={2}
                            >
                                <CustomGrid container flex={1}>
                                    <CustomTypography
                                        translation="features.payWall"
                                        nameSpace="meeting"
                                    />
                                    <CustomGrid
                                        container
                                        className={styles.amountInput}
                                        wrap="nowrap"
                                        justifyContent="space-between"
                                    >
                                        <InputBase
                                            type="number"
                                            placeholder="Amount"
                                            inputProps={{
                                                'aria-label': 'amount',
                                            }}
                                            classes={{
                                                root: styles.inputWrapper,
                                                input: styles.input,
                                            }}
                                            {...registerPaywallData}
                                            onFocus={handleFocusInput}
                                            disabled={
                                                !isPaywallPaymentEnabled ||
                                                !isConnectStripe
                                            }
                                        />
                                        <ValuesSwitcher
                                            values={currencyValues}
                                            activeValue={targetPaywallCurrency}
                                            onValueChanged={value =>
                                                handleValueChanged(
                                                    value,
                                                    'paywallCurrency',
                                                )
                                            }
                                            className={styles.switcher}
                                        />
                                    </CustomGrid>
                                    <ErrorMessage
                                        error={paywallPriceMessage}
                                        className={styles.error}
                                    />
                                </CustomGrid>
                                <CustomBox marginTop={4.5}>
                                    <Controller
                                        control={control}
                                        name="isPaywallPayment"
                                        render={({
                                            field: {
                                                onChange,
                                                value,
                                                name,
                                                ref,
                                            },
                                        }) => (
                                            <CustomSwitch
                                                name={name}
                                                onChange={onChange}
                                                checked={value}
                                                inputRef={ref}
                                                disabled={!isConnectStripe}
                                            />
                                        )}
                                    />
                                </CustomBox>
                            </CustomGrid>
                        </CustomGrid>
                        <CustomButton
                            type="submit"
                            className={styles.button}
                            disabled={!isConnectStripe}
                            label={
                                <Translation
                                    nameSpace="common"
                                    translation="buttons.save"
                                />
                            }
                            ref={buttonSaveRef}
                            id="buttonSubmit"
                            onAnimationEnd={handleEndAnimation}
                        />
                    </CustomGrid>
                </form>
            </FormProvider>
        </>
    );
};

export const MeetingMonetization = memo(Component);
