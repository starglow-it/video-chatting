import React, { memo, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { FormProvider, Controller, useForm, useWatch } from 'react-hook-form';
import { Fade, InputBase } from '@mui/material';
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
import { LabeledSwitch } from '@library/common/LabeledSwitch/LabeledSwitch';
import { ValuesSwitcher } from 'shared-frontend/library/common/ValuesSwitcher';

// validation
import { Translation } from '@library/common/Translation/Translation';
import { templatePriceSchema, paywallPriceSchema } from '../../../validation/payments/templatePrice';
import { booleanSchema, simpleStringSchema } from '../../../validation/common';

// styles
import styles from './MeetingMonetization.module.scss';

// stores
import { $meetingTemplateStore, updateMeetingTemplateFxWithData } from '../../../store/roomStores';

// const
import { currencyValues } from '../../../const/profile/subscriptions';
import {ErrorMessage} from "@library/common/ErrorMessage/ErrorMessage";
import { MeetingConnectStripe } from '../MeetingConnectStripe/MeetingConnectStripe';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { ValuesSwitcherItem } from 'shared-frontend/types';

const validationSchema = yup.object({
    templatePrice: templatePriceSchema(),
    paywallPrice: paywallPriceSchema(),
    isMonetizationEnabled: booleanSchema().required('required'),
    templateCurrency: simpleStringSchema().required('required'),
});

const Component = ({ onUpdate }: { onUpdate: () => void }) => {
    const meetingTemplate = useStore($meetingTemplateStore);

    const resolver = useYupValidationResolver<{
        templateCurrency: string;
        templatePrice: number;
        paywallPrice: number;
        paywallCurrency: string;
        isMonetizationEnabled: boolean;
        isInmeetingPayment: boolean;
        isPaywallPayment: boolean;
    }>(validationSchema);

    const methods = useForm({
        criteriaMode: 'all',
        resolver,
        defaultValues: {
            isInmeetingPayment: false,
            isPaywallPayment: false,
            isMonetizationEnabled: Boolean(meetingTemplate.isMonetizationEnabled),
            templatePrice: meetingTemplate.templatePrice || 10,
            paywallPrice: 10,
            templateCurrency: meetingTemplate.templateCurrency || 'USD',
            paywallCurrency: meetingTemplate.templateCurrency || 'USD',
        },
    });

    const { register, setValue, control, handleSubmit, formState: { errors } } = methods;

    const handleValueChanged = useCallback((newValue: ValuesSwitcherItem<"USD" | "CAD", string>, type: 'templateCurrency' | 'paywallCurrency') => {
        setValue(type, newValue.value);
    }, []);

    const isMonetizationEnabled = useWatch({
        control,
        name: 'isMonetizationEnabled',
    });

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
            currencyValues.find(currency => currency.value === activeTemplateCurrency) || currencyValues[0],
        [activeTemplateCurrency],
    );

    const activePaywallCurrency = useWatch({
        control,
        name: 'paywallCurrency',
    });

    const targetPaywallCurrency = useMemo(
        () =>
            currencyValues.find(currency => currency.value === activePaywallCurrency) || currencyValues[0],
        [activePaywallCurrency],
    );

    const onSubmit = useCallback(
        handleSubmit(async data => {
            await updateMeetingTemplateFxWithData(data);

            onUpdate?.();
        }),
        [],
    );

    const registerData = register('templatePrice');
    const registerPaywallData = register('paywallPrice');

    const templatePriceMessage = ['min', 'max'].includes(errors?.templatePrice?.[0]?.type)
        ? errors?.templatePrice?.[0]?.message
        : '';
    const paywallPriceMessage = ['min', 'max'].includes(errors?.paywallPrice?.[0]?.type)
        ? errors?.paywallPrice?.[0]?.message : '';

    return (
        <>
            <CustomGrid container columnGap={4} direction='row' alignItems='center' marginBottom={2}>
                <CustomGrid display='flex' alignItems='center' color="colors.white.primary" >
                    <MonetizationIcon width="24px" height="24px" />
                    <CustomTypography translation="features.monetization" nameSpace="meeting"/>
                </CustomGrid>                
                <CustomBox style={{flex: 1}}>
                    <MeetingConnectStripe />
                </CustomBox>
            </CustomGrid>            
            <FormProvider {...methods}>
                <form onSubmit={onSubmit}>
                    <CustomGrid container direction="column" wrap="nowrap" gap={2}>
                        <Controller
                            control={control}
                            name="isMonetizationEnabled"
                            render={({ field: { onChange, value, name, ref } }) => (
                                <CustomSwitch
                                    name={name}
                                    onChange={onChange}
                                    checked={value}
                                    inputRef={ref}
                                />
                            )}
                        />
                        <Fade in={isMonetizationEnabled}>
                            <CustomGrid
                                container direction="column" wrap="nowrap" gap={2}
                                className={clsx(styles.wrapperForm, {
                                    [styles.active]: isMonetizationEnabled
                                })}
                            >
                                <CustomGrid
                                    container
                                    wrap="nowrap"
                                    className={styles.monetization}
                                    gap={2}
                                >                                                        
                                    <CustomGrid container flex={1}>
                                        <CustomTypography translation="features.inMeeting" nameSpace="meeting"/>
                                        <CustomGrid
                                            container
                                            className={styles.amountInput}
                                            wrap="nowrap"
                                            justifyContent="space-between"
                                        >
                                            <InputBase
                                                type="number"
                                                placeholder="Amount"
                                                inputProps={{ 'aria-label': 'amount' }}
                                                classes={{
                                                    root: styles.inputWrapper,
                                                    input: styles.input,
                                                }}
                                                {...registerData}
                                                disabled={!isInmeetingPaymentEnabled}
                                            />
                                            <ValuesSwitcher
                                                values={currencyValues}
                                                activeValue={targetTemplateCurrency}
                                                onValueChanged={(value) => handleValueChanged(value, 'templateCurrency')}
                                                className={styles.switcher}
                                            />
                                        </CustomGrid>
                                        <ErrorMessage error={templatePriceMessage} className={styles.error} />                               
                                    </CustomGrid>
                                    <CustomBox marginTop={4.5}>
                                        <Controller
                                            control={control}
                                            name="isInmeetingPayment"
                                            render={({ field: { onChange, value, name, ref } }) => (
                                                <CustomSwitch
                                                    name={name}
                                                    onChange={onChange}
                                                    checked={value}
                                                    inputRef={ref}
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
                                        <CustomTypography translation="features.payWall" nameSpace="meeting"/>                                  
                                        <CustomGrid
                                            container
                                            className={styles.amountInput}
                                            wrap="nowrap"
                                            justifyContent="space-between"
                                        >
                                            <InputBase
                                                type="number"
                                                placeholder="Amount"
                                                inputProps={{ 'aria-label': 'amount' }}
                                                classes={{
                                                    root: styles.inputWrapper,
                                                    input: styles.input,
                                                }}
                                                {...registerPaywallData}
                                                disabled={!isPaywallPaymentEnabled}
                                            />
                                            <ValuesSwitcher
                                                values={currencyValues}
                                                activeValue={targetPaywallCurrency}
                                                onValueChanged={(value) => handleValueChanged(value, 'paywallCurrency')}
                                                className={styles.switcher}
                                            />
                                        </CustomGrid>
                                        <ErrorMessage error={paywallPriceMessage} className={styles.error} />                               
                                    </CustomGrid>
                                    <CustomBox marginTop={4.5}>
                                        <Controller
                                            control={control}
                                            name="isPaywallPayment"
                                            render={({ field: { onChange, value, name, ref } }) => (
                                                <CustomSwitch
                                                    name={name}
                                                    onChange={onChange}
                                                    checked={value}
                                                    inputRef={ref}
                                                />
                                            )}
                                        />   
                                    </CustomBox>
                                </CustomGrid>                                
                            </CustomGrid>
                        </Fade>
                        <CustomButton
                            type="submit"
                            className={styles.button}
                            disabled={!isPaywallPaymentEnabled && !isInmeetingPaymentEnabled && isMonetizationEnabled}
                            label={<Translation nameSpace="common" translation="buttons.save" />}
                        />
                    </CustomGrid>

                </form>
            </FormProvider>
        </>
    );
};

export const MeetingMonetization = memo(Component);
