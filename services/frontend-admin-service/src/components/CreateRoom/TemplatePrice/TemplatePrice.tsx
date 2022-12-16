import React, {memo, useCallback, useEffect, useMemo} from "react";
import InputBase from "@mui/material/InputBase";
import InputAdornment from "@mui/material/InputAdornment";
import {useFormContext, useWatch} from "react-hook-form";

import styles from "./TemplatePrice.module.scss";

import { CustomPaper } from "shared-frontend/library/custom/CustomPaper";
import { CustomGrid } from "shared-frontend/library/custom/CustomGrid";
import {CustomTypography} from "shared-frontend/library/custom/CustomTypography";
import {Translation} from "@components/Translation/Translation";
import {ValuesSwitcher} from "shared-frontend/library/common/ValuesSwitcher";
import {useValueSwitcher} from "shared-frontend/hooks/useValuesSwitcher";
import {ActionButton} from "shared-frontend/library/common/ActionButton";
import {ArrowLeftIcon} from "shared-frontend/icons/OtherIcons/ArrowLeftIcon";
import {ArrowRightIcon} from "shared-frontend/icons/OtherIcons/ArrowRightIcon";

import { TemplatePriceProps } from "./TemplatePrice.types";
import {ValuesSwitcherItem} from "shared-frontend/types";
import {CustomFade} from "shared-frontend/library/custom/CustomFade";

enum PriceValues {
    Free = 'free',
    Paid = 'paid',
}

enum PriceLabels {
    Free = 'Free',
    Paid = 'Paid',
}

const templatePriceTypes: ValuesSwitcherItem<PriceValues, PriceLabels>[] = [
    { id: 1, value: PriceValues.Free, label: PriceLabels.Free },
    { id: 2, value: PriceValues.Paid, label: PriceLabels.Paid },
];

export const TemplatePrice = memo(({
   onNextStep,
   onPreviousStep,
}: TemplatePriceProps) => {
    const { setValue, register, control } = useFormContext();

    const priceType = useWatch({
        control,
        name: 'type',
    });

    const {
        activeItem,
        onValueChange,
    } = useValueSwitcher<PriceValues, PriceLabels>({
        values: templatePriceTypes,
        initialValue: priceType ?? templatePriceTypes[0].value,
    });

    useEffect(() => {
        const newItem = templatePriceTypes.find(type => type.value === priceType);

        if (newItem) {
            onValueChange(newItem);
        }
    }, [priceType]);

    const handleChangePriceType = useCallback((item: ValuesSwitcherItem<PriceValues, PriceLabels>) => {
        setValue('type', item.value);
    }, []);

    const priceValueData = useMemo(() => register('templatePrice'), [])

    return (
        <CustomGrid
            container
            justifyContent="center"
            alignItems="center"
        >
            <CustomPaper
                variant="black-glass"
                className={styles.paper}
            >
                <CustomGrid container direction="column" alignItems="center">
                    <CustomTypography variant="h2bold" color="colors.white.primary">
                        <Translation nameSpace="rooms" translation="monetization.title" />
                    </CustomTypography>

                    <ValuesSwitcher<PriceValues, PriceLabels>
                        values={templatePriceTypes}
                        activeValue={activeItem}
                        onValueChanged={handleChangePriceType}
                        variant="transparent"
                        className={styles.switcher}
                        itemClassName={styles.switcherItem}
                    />

                    {activeItem.value === PriceValues.Paid
                        ? (
                            <CustomFade
                                open
                                className={styles.wrapper}
                            >
                                <InputBase
                                    type="number"
                                    placeholder="Amount"
                                    inputProps={{ 'aria-label': 'amount' }}
                                    classes={{
                                        root: styles.inputWrapper,
                                        input: styles.input,
                                    }}
                                    startAdornment={(
                                        <InputAdornment position="start">
                                            <CustomTypography color="colors.white.primary">
                                                $
                                            </CustomTypography>
                                        </InputAdornment>
                                    )}
                                    {...priceValueData}
                                />

                                <CustomTypography textAlign="center" color="colors.grayscale.normal">
                                    <Translation
                                        nameSpace="rooms"
                                        translation="monetization.minimal"
                                    />
                                </CustomTypography>
                            </CustomFade>
                        )
                        : null
                    }
                </CustomGrid>
            </CustomPaper>
            <CustomGrid
                container
                gap={1.5}
                flexWrap="nowrap"
                justifyContent="center"
                className={styles.buttonsGroup}
            >
                <ActionButton
                    variant="gray"
                    Icon={(
                        <ArrowLeftIcon
                            width="32px"
                            height="32px"
                        />
                    )}
                    className={styles.actionButton}
                    onAction={onPreviousStep}
                />
                <ActionButton
                    variant="accept"
                    Icon={
                        <ArrowRightIcon
                            width="32px"
                            height="32px"
                        />
                    }
                    className={styles.actionButton}
                    onAction={onNextStep}
                />
            </CustomGrid>
        </CustomGrid>
    )
})