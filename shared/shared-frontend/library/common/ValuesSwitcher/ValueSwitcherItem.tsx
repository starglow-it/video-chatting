import { ForwardedRef, forwardRef, memo, useCallback } from 'react';
import clsx from 'clsx';

import { CustomGrid } from '../../custom/CustomGrid';
import { CustomTypography } from '../../custom/CustomTypography';

import styles from './ValuesSwitcher.module.scss';

import { ValueSwitcherItemProps, ValueType } from './types';

const Component = <Value extends ValueType, Label extends string>(
    {
        activeValue,
        className,
        value,
        index,
        onValueChanged,
        variant = 'primary',
    }: ValueSwitcherItemProps<Value, Label>,
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
            className={clsx(styles.item, className, { [styles.active]: activeValue === value })}
        >
            <CustomTypography variant="body2">{value.label}</CustomTypography>
        </CustomGrid>
    );
};

const ValueSwitcherItem = memo(forwardRef(Component)) as typeof Component;

export { ValueSwitcherItem };
