import { memo, useCallback, useMemo, useRef } from 'react';
import {
    FormProvider,
    Controller,
    useForm,
    useWatch,
    FieldValues,
} from 'react-hook-form';
import { InputBase, MenuItem } from '@mui/material';
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
// validation
import { Translation } from '@library/common/Translation/Translation';
import { ErrorMessage } from '@library/common/ErrorMessage/ErrorMessage';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomDropdown } from '@library/custom/CustomDropdown/CustomDropdown';
import { NotificationType } from 'src/store/types';
import {
    templatePriceSchema,
    paywallPriceSchema,
} from '../../../validation/payments/templatePrice';
import { booleanSchema, simpleStringSchema } from '../../../validation/common';

// styles
import styles from './MeetingMonetization.module.scss';

// stores
import { $isConnectedStripe, addNotificationEvent } from '../../../store';
import {
    $meetingPaymentStore,
    $meetingTemplateStore,
    updateMeetingTemplateFxWithData,
    updatePaymentMeetingEvent,
} from '../../../store/roomStores';

// const
import { currencyValues } from '../../../const/profile/subscriptions';
import { MeetingConnectStripe } from '../MeetingConnectStripe/MeetingConnectStripe';
import { StripeCurrency } from 'shared-const';

const validationSchema = yup.object({
    templatePrice: templatePriceSchema(),
    paywallPrice: paywallPriceSchema(),
    templateCurrency: simpleStringSchema().required('required'),
});

const Component = ({ onUpdate }: { onUpdate: () => void }) => {
    const buttonSaveRef = useRef<HTMLButtonElement | null>(null);
    const { meeting: meetingPayment, paywall: paywallPayment } =
        useStore($meetingPaymentStore);
    const isConnectedStripe = useStore($isConnectedStripe);
    const resolver = useYupValidationResolver<FieldValues>(validationSchema);

    const methods = useForm({
        criteriaMode: 'all',
        resolver,
        defaultValues: {
            enabledMeeting: meetingPayment.enabled,
            enabledPaywall: paywallPayment.enabled,
            templatePrice: meetingPayment.price,
            paywallPrice: paywallPayment.price,
            templateCurrency: meetingPayment.currency,
            paywallCurrency: paywallPayment.currency,
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

    const onSubmit = useCallback(
        handleSubmit(async data => {
            // if (!res.success) {
            //     addNotificationEvent({
            //         message: res.error?.message ?? '',
            //         withErrorIcon: true,
            //         type: NotificationType.validationError,
            //     });
            //     return;
            // }
            updatePaymentMeetingEvent({
                meeting: {
                    enabled: data.enabledMeeting,
                    price: data.templatePrice,
                    currency: data.templateCurrency,
                },
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

    const renderTimeValue = useCallback((selected: any) => selected, []);

    const renderTimeList = useMemo(() => {
        return currencyValues.map(time => (
            <MenuItem key={time.id} value={time.value}>
                {time.label}
            </MenuItem>
        ));
    }, []);

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
                                            />
                                        </CustomGrid>
                                    </CustomGrid>
                                    <ErrorMessage
                                        error={templatePriceMessage}
                                        className={styles.error}
                                    />
                                </CustomGrid>
                                <CustomBox marginTop={4.5}>
                                    <Controller
                                        control={control}
                                        name="enabledMeeting"
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
                                                disabled={!isConnectedStripe}
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
                                            />
                                        </CustomGrid>
                                    </CustomGrid>
                                    <ErrorMessage
                                        error={paywallPriceMessage}
                                        className={styles.error}
                                    />
                                </CustomGrid>
                                <CustomBox marginTop={4.5}>
                                    <Controller
                                        control={control}
                                        name="enabledPaywall"
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
                                                disabled={!isConnectedStripe}
                                            />
                                        )}
                                    />
                                </CustomBox>
                            </CustomGrid>
                        </CustomGrid>
                        <CustomButton
                            type="submit"
                            className={styles.button}
                            disabled={!isConnectedStripe}
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
