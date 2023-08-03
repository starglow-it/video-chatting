import { memo, useCallback, useMemo } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import clsx from 'clsx';
import { Fade, InputBase } from '@mui/material';

// components
import { LabeledSwitch } from '@library/common/LabeledSwitch/LabeledSwitch';
import { MonetizationIcon } from 'shared-frontend/icons/OtherIcons/MonetizationIcon';
import { ValuesSwitcher } from 'shared-frontend/library/common/ValuesSwitcher';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomDivider } from 'shared-frontend/library/custom/CustomDivider';
import { CustomSwitch } from '@library/custom/CustomSwitch/CustomSwitch';

// styles
import styles from './EditMonetization.module.scss';

// const
import { currencyValues } from '../../../const/profile/subscriptions';

const Component = () => {
    const { register, control, setValue } = useFormContext();

    const handleValueChanged = useCallback((newValue: any) => {
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
            currencyValues.find(
                currency => currency.value === activeCurrency,
            ) || currencyValues[0],
        [activeCurrency],
    );

    const registerData = register('templatePrice');

    return (
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
                    <CustomDivider />
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
                </CustomBox>
            </Fade>
        </CustomGrid>
    );
};

export const EditMonetization = memo(Component);
