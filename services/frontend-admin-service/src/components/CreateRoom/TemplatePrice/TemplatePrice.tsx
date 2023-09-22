import { memo, useCallback, useEffect, useMemo } from 'react';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import { useFormContext, useWatch } from 'react-hook-form';

// custom
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { CustomFade } from 'shared-frontend/library/custom/CustomFade';
import { ValuesSwitcher } from 'shared-frontend/library/common/ValuesSwitcher';
import { useValueSwitcher } from 'shared-frontend/hooks/useValuesSwitcher';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { ArrowLeftIcon } from 'shared-frontend/icons/OtherIcons/ArrowLeftIcon';

// components
import { Translation } from '@components/Translation/Translation';

// types
import { ValuesSwitcherItem } from 'shared-frontend/types';
import { PriceLabels, PriceValues } from 'shared-types';
import { TemplatePriceProps } from './TemplatePrice.types';

// styles
import styles from './TemplatePrice.module.scss';

const templatePriceTypes: ValuesSwitcherItem<PriceValues, PriceLabels>[] = [
    {
        id: 1,
        value: PriceValues.Free,
        label: PriceLabels.Free,
    },
    {
        id: 2,
        value: PriceValues.Paid,
        label: PriceLabels.Paid,
    },
];

const TemplatePrice = memo(
    ({ onPreviousStep, submitButtons }: TemplatePriceProps) => {
        const {
            setValue,
            register,
            control,
            formState: { errors },
            clearErrors,
        } = useFormContext();

        const priceType = useWatch({
            control,
            name: 'type',
        });

        const { activeItem, onValueChange } = useValueSwitcher<
            PriceValues,
            PriceLabels
        >({
            values: templatePriceTypes,
            initialValue: priceType ?? templatePriceTypes[0].value,
        });

        useEffect(() => {
            const newItem = templatePriceTypes.find(
                type => type.value === priceType,
            );

            if (newItem) {
                onValueChange(newItem);
            }
        }, [priceType]);

        const handleChangePriceType = useCallback(
            (item: ValuesSwitcherItem<PriceValues, PriceLabels>) => {
                setValue('type', item.value);
                if (item.value === PriceValues.Free) {
                    clearErrors();
                }
            },
            [],
        );

        const priceValueData = useMemo(() => register('templatePrice'), []);

        const templatePriceError = errors?.templatePrice?.[0]?.message || '';

        return (
            <CustomGrid container justifyContent="center" alignItems="center">
                <CustomPaper variant="black-glass" className={styles.paper}>
                    <CustomGrid
                        container
                        direction="column"
                        alignItems="center"
                    >
                        <CustomTypography
                            variant="h2bold"
                            color="colors.white.primary"
                        >
                            <Translation
                                nameSpace="rooms"
                                translation="monetization.title"
                            />
                        </CustomTypography>

                        <CustomTypography
                            variant="h5"
                            color="colors.white.primary"
                            fontSize="14px"
                        >
                            <Translation
                                nameSpace="rooms"
                                translation="monetization.userPay"
                            />
                        </CustomTypography>

                        <ValuesSwitcher<PriceValues, PriceLabels>
                            values={templatePriceTypes}
                            activeValue={activeItem}
                            onValueChanged={handleChangePriceType}
                            variant="transparent"
                            className={styles.switcher}
                            itemClassName={styles.switcherItem}
                        />

                        {activeItem.value === PriceValues.Paid ? (
                            <CustomFade open className={styles.wrapper}>
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
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <CustomTypography color="colors.white.primary">
                                                $
                                            </CustomTypography>
                                        </InputAdornment>
                                    }
                                    {...priceValueData}
                                />

                                <CustomTypography
                                    textAlign="center"
                                    color={
                                        templatePriceError
                                            ? 'colors.red.primary'
                                            : 'colors.grayscale.normal'
                                    }
                                >
                                    <Translation
                                        nameSpace="rooms"
                                        translation="monetization.minimal"
                                    />
                                </CustomTypography>
                            </CustomFade>
                        ) : null}
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
                        Icon={<ArrowLeftIcon width="32px" height="32px" />}
                        className={styles.actionButton}
                        onAction={onPreviousStep}
                    />
                    {submitButtons}
                </CustomGrid>
            </CustomGrid>
        );
    },
);

TemplatePrice.displayName = 'TemplatePrice';

export { TemplatePrice };
