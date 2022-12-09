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
import { templatePriceSchema } from '../../../validation/payments/templatePrice';
import { booleanSchema, simpleStringSchema } from '../../../validation/common';

// styles
import styles from './MeetingMonetization.module.scss';

// stores
import { $meetingTemplateStore, updateMeetingTemplateFxWithData } from '../../../store/roomStores';

// const
import { currencyValues } from '../../../const/profile/subscriptions';
import {ErrorMessage} from "@library/common/ErrorMessage/ErrorMessage";

const validationSchema = yup.object({
    templatePrice: templatePriceSchema(),
    isMonetizationEnabled: booleanSchema().required('required'),
    templateCurrency: simpleStringSchema().required('required'),
});

const Component = ({ onUpdate }: { onUpdate: () => void }) => {
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

    const { register, setValue, control, handleSubmit, formState: { errors } } = methods;

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

            onUpdate?.();
        }),
        [],
    );

    const registerData = register('templatePrice');

    const templatePriceMessage = ['min', 'max'].includes(errors?.templatePrice?.[0]?.type)
        ? errors?.templatePrice?.[0]?.message
        : '';

    return (
        <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
                <CustomGrid container direction="column" wrap="nowrap">
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
                            <CustomGrid container>
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
                                        values={currencyValues}
                                        activeValue={targetCurrency}
                                        onValueChanged={handleValueChanged}
                                        className={styles.switcher}
                                    />
                                </CustomGrid>
                                <ErrorMessage error={templatePriceMessage} className={styles.error} />
                            </CustomGrid>
                        </Fade>
                    </CustomGrid>
                    <CustomButton
                        type="submit"
                        className={styles.button}
                        label={<Translation nameSpace="common" translation="buttons.save" />}
                    />
                </CustomGrid>
            </form>
        </FormProvider>
    );
};

export const MeetingMonetization = memo(Component);
