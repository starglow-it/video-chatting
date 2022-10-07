import React, { memo, useMemo, useCallback, useState } from 'react';
import clsx from 'clsx';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import { ValueSwitcherItem } from './ValueSwitcherItem';

// styles
import styles from './ValuesSwitcher.module.scss';

// types
import { ValueSwitcherProps } from './types';

const Component = <ValueType extends string | number>({
    optionWidth,
    values,
    activeValue,
    onValueChanged,
    variant = 'primary',
}: ValueSwitcherProps<ValueType>) => {
    const [left, setLeft] = useState(0);

    const handleUpdateActiveElement = useCallback(
        (newLeft: number) => {
            const shift = variant === 'transparent' ? 6 : 0;
            setLeft(newLeft + shift);
        },
        [variant],
    );

    const renderValues = useMemo(
        () =>
            values.map((value, index) => (
                <ValueSwitcherItem
                    key={value.id}
                    index={index}
                    value={value}
                    variant={variant}
                    optionWidth={optionWidth}
                    activeValue={activeValue}
                    onValueChanged={onValueChanged}
                    onUpdateActiveElement={handleUpdateActiveElement}
                />
            )),
        [values, activeValue, onValueChanged, variant],
    );

    const style = useMemo(
        () => ({ '--left': `${left}px`, '--width': `${optionWidth}px` } as React.CSSProperties),
        [left],
    );

    return (
        <CustomGrid
            container
            wrap="nowrap"
            className={clsx(styles.wrapper, {
                [styles.primary]: variant === 'primary',
                [styles.transparent]: variant === 'transparent',
            })}
        >
            <CustomGrid
                className={styles.activeItem}
                style={style}
                container
                alignItems="center"
                justifyContent="center"
            >
                <CustomTypography variant="body2">{activeValue.label}</CustomTypography>
            </CustomGrid>
            {renderValues}
        </CustomGrid>
    );
};

export const ValuesSwitcher = memo(Component) as typeof Component;
