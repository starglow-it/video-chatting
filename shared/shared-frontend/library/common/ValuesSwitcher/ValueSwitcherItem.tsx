import { ForwardedRef, forwardRef, memo, useCallback } from 'react';
import clsx from 'clsx';

import { CustomGrid, CustomTypography } from '../../custom';

import styles from './ValuesSwitcher.module.scss';

import { ValueSwitcherItemProps } from './types';

const Component = <ValueType extends number | string>(
    {
        activeValue,
        value,
        index,
        onValueChanged,
        variant = 'primary',
    }: ValueSwitcherItemProps<ValueType>,
    ref: ForwardedRef<HTMLDivElement>,
) => {
    const handleChooseValue = useCallback(() => {
        if (activeValue !== value) {
            onValueChanged(value);
        }
    }, [onValueChanged, activeValue, value]);

    return (
        <CustomGrid
            container
            ref={ref}
            alignItems="center"
            justifyContent="center"
            onClick={handleChooseValue}
            className={clsx(styles.item, { [styles.active]: activeValue === value })}
        >
            <CustomTypography variant="body2">{value.label}</CustomTypography>
        </CustomGrid>
    );
};

export const ValueSwitcherItem = memo(forwardRef(Component));
