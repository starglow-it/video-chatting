import React, { memo, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { FormProvider, Controller, useForm, useWatch } from 'react-hook-form';
import { Fade, InputBase } from '@mui/material';
import * as yup from 'yup';
import { useStore } from 'effector-react';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';

// icons
import { MonetizationIcon } from '@library/icons/MonetizationIcon';

// custom
import { CustomSwitch } from '@library/custom/CustomSwitch/CustomSwitch';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// common
import { LabeledSwitch } from '@library/common/LabeledSwitch/LabeledSwitch';
import { ValuesSwitcher } from '@library/common/ValuesSwitcher/ValuesSwitcher';

// validation
import { templatePriceSchema } from '../../../validation/payments/templatePrice';
import { booleanSchema, simpleStringSchema } from '../../../validation/common';

// styles
import styles from './MeetingMonetization.module.scss';

// stores
import { $meetingTemplateStore, updateMeetingTemplateFxWithData } from '../../../store';

// const
import { currencyValues } from '../../../const/profile/subscriptions';

const validationSchema = yup.object({
    templatePrice: templatePriceSchema(),
    isMonetizationEnabled: booleanSchema().required('required'),
    templateCurrency: simpleStringSchema().required('required'),
});

const Component = () => {
    const meetingTemplate = useStore($meetingTemplateStore);

    const resolver = useYupValidationResolver<{
        templateCurrency: string;
        templatePrice: number;
        isMonetizationEnabled: boolean;
    }>(validationSchema);

    const methods = useForm({
        criteriaMode: 'all',
        resolver,
        defaultValues: {
            isMonetizationEnabled: Boolean(meetingTemplate.isMonetizationEnabled),
            templatePrice: meetingTemplate.templatePrice || 10,
            templateCurrency: meetingTemplate.templateCurrency || 'USD',
        },
    });

    const { register, setValue, control, handleSubmit } = methods;

    const handleValueChanged = useCallback(newValue => {
        setValue('templateCurrency', newValue.value);
    }, []);

    const isMonetizationEnabled = useWatch({
        control,
        name: 'isMonetizationEnabled',
    });

    const activeCurrency = useWatch({
        control,
        name: 'templateCurrency',
    });

    const targetCurrency = useMemo(
        () =>
            currencyValues.find(currency => currency.value === activeCurrency) || currencyValues[0],
        [activeCurrency],
    );

    const onSubmit = useCallback(
        handleSubmit(async data => {
            await updateMeetingTemplateFxWithData(data);
        }),
        [],
    );

    const registerData = register('templatePrice');

    return (
        <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
                <CustomGrid
                    container
                    direction="column"
                    wrap="nowrap"
                    className={clsx(styles.monetization, {
                        [styles.active]: isMonetizationEnabled,
                    })}
                >
                    <LabeledSwitch
                        Icon={<MonetizationIcon width="24px" height="24px" />}
                        nameSpace="meeting"
                        color="colors.white.primary"
                        translation="features.monetization"
                        className={styles.labelWrapper}
                        SwitchComponent={
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
                        }
                    />
                    <Fade in={isMonetizationEnabled}>
                        <CustomBox>
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
                                />
                                <ValuesSwitcher
                                    optionWidth={56}
                                    values={currencyValues}
                                    activeValue={targetCurrency}
                                    onValueChanged={handleValueChanged}
                                />
                            </CustomGrid>
                        </CustomBox>
                    </Fade>
                </CustomGrid>
            </form>
        </FormProvider>
    );
};

export const MeetingMonetization = memo(Component);
