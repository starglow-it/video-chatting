import React, { memo, useMemo, useState, useRef, useLayoutEffect } from 'react';
import { useStore } from 'effector-react';

import clsx from 'clsx';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// components
import { ValueSwitcherItem } from './ValueSwitcherItem';

// styles
import styles from './ValuesSwitcher.module.scss';

// store
import { $windowSizeStore } from '../../../store';

// types
import { ValueSwitcherProps } from './types';

const Component = <ValueType extends string | number>({
    values,
    activeValue,
    onValueChanged,
    variant = 'primary',
    className,
}: ValueSwitcherProps<ValueType>) => {
    const [activeElementIndex, setActiveElementIndex] = useState<number | null>(null);
    const activeElementRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { width } = useStore($windowSizeStore);

    useLayoutEffect(() => {
        setActiveElementIndex(values.indexOf(activeValue));
    }, [activeValue, values]);

    const renderValues = useMemo(
        () =>
            values.map((value, index) => (
                <ValueSwitcherItem
                    key={value.id}
                    ref={value.id === activeValue.id ? activeElementRef : null}
                    index={index}
                    value={value}
                    variant={variant}
                    activeValue={activeValue}
                    onValueChanged={onValueChanged}
                />
            )),
        [values, activeValue, onValueChanged, variant],
    );

    const style = useMemo(() => {
        const left = activeElementRef.current?.offsetLeft ?? 0;
        return {
            '--width': `${activeElementRef.current?.clientWidth ?? 0}px`,
            left: left,
        } as React.CSSProperties;
    }, [activeElementIndex, width]);

    return (
        <CustomGrid
            container
            wrap="nowrap"
            justifyContent="space-evenly"
            ref={containerRef}
            className={clsx(styles.wrapper, className, {
                [styles.primary]: variant === 'primary',
                [styles.transparent]: variant === 'transparent',
            })}
        >
            <CustomGrid className={clsx(styles.transition)} style={style} container />
            {renderValues}
        </CustomGrid>
    );
};

export const ValuesSwitcher = memo(Component) as typeof Component;
