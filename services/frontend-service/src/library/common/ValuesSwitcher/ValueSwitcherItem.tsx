import { ForwardedRef, forwardRef, memo, useCallback } from 'react';
import clsx from 'clsx';

import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

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
        onValueChanged(value);
    }, [onValueChanged]);

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
