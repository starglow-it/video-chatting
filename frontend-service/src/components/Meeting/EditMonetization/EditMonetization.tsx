import React, {memo, useCallback, useMemo } from "react";
import {Controller, useFormContext, useWatch} from "react-hook-form";
import clsx from "clsx";
import {Fade, InputBase} from "@mui/material";

// components
import {LabeledSwitch} from "@library/common/LabeledSwitch/LabeledSwitch";
import {MonetizationIcon} from "@library/icons/MonetizationIcon";
import {ValuesSwitcher} from "@library/common/ValuesSwitcher/ValuesSwitcher";

// custom
import {CustomGrid} from "@library/custom/CustomGrid/CustomGrid";
import {CustomBox} from "@library/custom/CustomBox/CustomBox";
import {CustomDivider} from "@library/custom/CustomDivider/CustomDivider";
import {CustomSwitch} from "@library/custom/CustomSwitch/CustomSwitch";

// types
import {ValuesSwitcherItem} from "@library/common/ValuesSwitcher/types";

// styles
import styles from "./EditMonetization.module.scss";

const currencyValues: ValuesSwitcherItem[] = [
    { id: 1, value: "USD", label: "USD" },
    { id: 2, value: "CAD", label: "CAD"}
];

const Component = () => {
    const { register, control, setValue } = useFormContext();

    const handleValueChanged = useCallback((newValue) => {
        setValue('templateCurrency', newValue.value);
    }, []);

    const isMonetizationEnabled = useWatch({
        control,
        name: 'isMonetizationEnabled'
    });

    const activeCurrency = useWatch({
        control,
        name: 'templateCurrency',
    });

    const targetCurrency = useMemo(() => (
        currencyValues.find(currency => currency.value === activeCurrency) || currencyValues[0]
    ), [activeCurrency]);

    const regsiterData = register('templatePrice');

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
                SwitchComponent={(
                    <Controller
                        control={control}
                        name="isMonetizationEnabled"
                        render={({
                            field: { onChange, value, name, ref },
                        }) => (
                            <CustomSwitch
                                name={name}
                                onChange={onChange}
                                checked={value}
                                inputRef={ref}
                            />
                        )}
                    />
                )}
            />
            <Fade in={isMonetizationEnabled}>
                <CustomBox>
                    <CustomDivider />
                    <CustomGrid container className={styles.amountInput} wrap="nowrap" justifyContent="space-between">
                        <InputBase
                            type="number"
                            placeholder="Amount"
                            inputProps={{ 'aria-label': 'amount' }}
                            classes={{
                                root: styles.inputWrapper,
                                input: styles.input
                            }}
                            {...regsiterData}
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
    );
}

export const EditMonetization = memo(Component);