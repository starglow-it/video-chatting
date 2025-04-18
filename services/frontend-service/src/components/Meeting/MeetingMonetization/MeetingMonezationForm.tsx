import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import { createRoomRoute } from 'src/const/client-routes';

import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { InputBase, MenuItem } from '@mui/material';
import { CustomDropdown } from '@library/custom/CustomDropdown/CustomDropdown';
import { ErrorMessage } from '@library/common/ErrorMessage/ErrorMessage';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomSwitch } from '@library/custom/CustomSwitch/CustomSwitch';
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';
import {
    Controller,
    FieldValues,
    FormProvider,
    useForm,
    useWatch,
} from 'react-hook-form';
import * as yup from 'yup';
import {
    simpleStringSchema,
    templatePriceSchema,
} from 'shared-frontend/validation';
import { paywallPriceSchema } from 'src/validation/payments/templatePrice';
import { forwardRef, useCallback, useImperativeHandle, useMemo } from 'react';
import { StripeCurrency } from 'shared-const';
import { currencyValues } from 'src/const/profile/subscriptions';
import { $isConnectedStripe } from 'src/store';
import { togglePaymentCurrencyPanelEvent } from 'src/store/roomStores';
import { useStore } from 'effector-react';
import { PaymentItem } from 'src/store/roomStores/meeting/meetingPayment/type';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import { Translation } from '@library/common/Translation/Translation';
import styles from './MeetingMonetization.module.scss';
import { FormDataPayment, TabsValues } from './type';

const validationSchema = yup.object({
    templatePrice: templatePriceSchema(),
    paywallPrice: paywallPriceSchema(),
    templateCurrency: simpleStringSchema().required('required'),
});

type MonezationFormProps = {
    onFocusInput(): void;
    paymentMeeting: PaymentItem;
    paymentPaywall: PaymentItem;
    enableForm: boolean;
    activeValue: TabsValues;
    isCreate: boolean;
    onSave: () => void
};

export const MeetingMonezationForm = forwardRef(
    (
        {
            onFocusInput,
            paymentMeeting,
            paymentPaywall,
            enableForm,
            activeValue,
            isCreate = false,
            onSave = () => { }
        }: MonezationFormProps,
        ref: any,
    ) => {
        const isConnectedStripe = useStore($isConnectedStripe);
        const router = useRouter();
        const currentUrl = router.asPath;

        const resolver =
            useYupValidationResolver<FieldValues>(validationSchema);

        const methods = useForm({
            criteriaMode: 'all',
            resolver,
            defaultValues: {
                enabledMeeting: paymentMeeting.enabled,
                enabledPaywall: paymentPaywall.enabled,
                templatePrice: paymentMeeting.price,
                paywallPrice: paymentPaywall.price,
                templateCurrency: paymentMeeting.currency,
                paywallCurrency: paymentPaywall.currency,
            } as FormDataPayment,
        });

        const {
            register,
            setValue,
            control,
            formState: { errors },
            getValues,
        } = methods;

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

        const renderTimeValue = useCallback((selected: any) => selected, []);

        const isTabParticipant = activeValue === TabsValues.Participants;

        const renderTimeList = useMemo(() => {
            return currencyValues.map(time => (
                <MenuItem
                    key={time.id}
                    value={time.value}
                    className={styles.menuItem}
                >
                    {time.label}
                </MenuItem>
            ));
        }, []);

        const handleValueChanged = useCallback(
            (
                newValue: StripeCurrency,
                type: 'templateCurrency' | 'paywallCurrency',
            ) => {
                setValue(type, newValue);
            },
            [],
        );

        const enabledMeeting = useWatch({
            control,
            name: 'enabledMeeting',
        });

        const enabledPaywall = useWatch({
            control,
            name: 'enabledPaywall',
        });

        const templateCurrency = useWatch({
            control,
            name: 'templateCurrency',
        });

        const paywallCurrency = useWatch({
            control,
            name: 'paywallCurrency',
        });

        const isFirstRender = useRef(true);

        useEffect(() => {
            async function handleEnabledSwitcher() {
                await onSave();
            }
            if (currentUrl.includes(createRoomRoute)) {
                handleEnabledSwitcher();
            } else {
                if (!isFirstRender.current) {
                    handleEnabledSwitcher();
                } else {
                    isFirstRender.current = false;
                }
            }
        }, [enabledMeeting, enabledPaywall, templateCurrency, paywallCurrency]);

        useImperativeHandle(ref, () => ({
            getValues,
        }));

        if (!enableForm) return null;

        return (
            <FormProvider {...methods}>
                <form>
                    <CustomGrid
                        container
                        direction="column"
                        wrap="nowrap"
                        gap={2}
                        className={styles.wrapperForm}
                        sx={{
                            height: {
                                xs: '200px',
                                sm: '200px',
                                md: '200px',
                                xl: '200px',
                            },
                        }}
                    >
                        <CustomGrid
                            container
                            wrap="nowrap"
                            className={styles.monetization}
                            gap={1}
                            sx={{
                                width: {
                                    xs: '100%',
                                    sm: '100%',
                                    md: 340,
                                    xl: 340,
                                },
                                flexDirection: {
                                    xs: 'column',
                                    sm: 'column',
                                    md: 'column',
                                    xl: 'column',
                                },
                            }}
                        >
                            <CustomGrid
                                container
                                flex={1}
                                gap={1}
                                alignItems="center"
                            >
                                <CustomTooltip
                                    title={
                                        <Translation
                                            nameSpace="meeting"
                                            translation={`features.${isTabParticipant
                                                ? 'tooltipParticipantPaywall'
                                                : 'tooltipAudiencePaywall'
                                                }`}
                                        />
                                    }
                                    tooltipClassName={styles.tooltipField}
                                    placement="left"
                                >
                                    <CustomTypography
                                        translation="features.payWall"
                                        nameSpace="meeting"
                                        fontSize={13}
                                        color={!isCreate ? 'black' : 'white'}
                                    />
                                </CustomTooltip>
                                <CustomBox flex={1} />
                                <CustomBox>
                                    <Controller
                                        control={control}
                                        name="enabledPaywall"
                                        render={({
                                            field: {
                                                onChange,
                                                value,
                                                name,
                                                ref: refPaywall,
                                            },
                                        }) => (
                                            <CustomSwitch
                                                name={name}
                                                onChange={onChange}
                                                checked={value}
                                                inputRef={refPaywall}
                                                disabled={!isConnectedStripe}
                                            />
                                        )}
                                    />
                                </CustomBox>
                            </CustomGrid>
                            <CustomGrid>
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
                                            root: `${isCreate ? styles.createForm : ''} ${styles.inputWrapper} `,
                                            input: styles.input,
                                        }}
                                        {...registerPaywallData}
                                        onFocus={onFocusInput}
                                        disabled={
                                            !enabledPaywall ||
                                            !isConnectedStripe
                                        }
                                    />
                                    <CustomGrid>
                                        <CustomDropdown
                                            selectId="currencyPaywallSelect"
                                            labelId="currencyPaywall"
                                            value={[paywallCurrency]}
                                            className={styles.switcher}
                                            renderValue={renderTimeValue}
                                            list={renderTimeList}
                                            onChange={(event: any) =>
                                                handleValueChanged(
                                                    event.target.value,
                                                    'paywallCurrency',
                                                )
                                            }
                                            onOpen={() => togglePaymentCurrencyPanelEvent(true)}
                                            onClose={() => togglePaymentCurrencyPanelEvent(false)}
                                        />
                                    </CustomGrid>
                                </CustomGrid>
                                <ErrorMessage
                                    error={paywallPriceMessage}
                                    className={styles.error}
                                />
                            </CustomGrid>
                        </CustomGrid>
                        <CustomGrid
                            container
                            wrap="nowrap"
                            className={styles.monetization}
                            gap={1}
                            sx={{
                                width: {
                                    xs: '100%',
                                    sm: '100%',
                                    md: 340,
                                    xl: 340,
                                },
                                flexDirection: {
                                    xs: 'column',
                                    sm: 'column',
                                    md: 'column',
                                    xl: 'column',
                                },
                            }}
                        >
                            <CustomGrid
                                container
                                flex={1}
                                gap={1}
                                alignItems="center"
                            >
                                <CustomTooltip
                                    tooltipClassName={styles.tooltipField}
                                    placement="left"
                                    title={
                                        <Translation
                                            nameSpace="meeting"
                                            translation={`features.${isTabParticipant
                                                ? 'tooltipParticipantInMeeting'
                                                : 'tooltipAudienceInMeeting'
                                                }`}
                                        />
                                    }
                                >
                                    <CustomTypography
                                        translation="features.inMeeting"
                                        nameSpace="meeting"
                                        fontSize={13}
                                        color={!isCreate ? 'black' : 'white'}
                                    />
                                </CustomTooltip>
                                <CustomBox flex={1} />
                                <CustomBox>
                                    <Controller
                                        control={control}
                                        name="enabledMeeting"
                                        render={({
                                            field: {
                                                onChange,
                                                value,
                                                name,
                                                ref: refMeeting,
                                            },
                                        }) => (
                                            <CustomSwitch
                                                name={name}
                                                onChange={onChange}
                                                checked={value}
                                                inputRef={refMeeting}
                                                disabled={!isConnectedStripe}
                                            />
                                        )}
                                    />
                                </CustomBox>
                            </CustomGrid>
                            <CustomGrid>
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
                                            root: `${isCreate ? styles.createForm : ''} ${styles.inputWrapper}`,
                                            input: styles.input,
                                        }}
                                        {...registerData}
                                        onFocus={onFocusInput}
                                        disabled={
                                            !enabledMeeting ||
                                            !isConnectedStripe
                                        }
                                    />
                                    <CustomGrid>
                                        <CustomDropdown
                                            selectId="currencyInMeetingSelect"
                                            labelId="currencyInMeeting"
                                            value={[templateCurrency]}
                                            className={styles.switcher}
                                            renderValue={renderTimeValue}
                                            list={renderTimeList}
                                            onChange={(event: any) =>
                                                handleValueChanged(
                                                    event.target.value,
                                                    'templateCurrency',
                                                )
                                            }
                                            onOpen={() => togglePaymentCurrencyPanelEvent(true)}
                                            onClose={() => togglePaymentCurrencyPanelEvent(false)}
                                        />
                                    </CustomGrid>
                                </CustomGrid>
                                <ErrorMessage
                                    error={templatePriceMessage}
                                    className={styles.error}
                                />
                            </CustomGrid>
                        </CustomGrid>
                    </CustomGrid>
                </form>
            </FormProvider>
        );
    },
);
