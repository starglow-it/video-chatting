import React, { memo, useMemo, useState, useRef, useLayoutEffect } from 'react';
import clsx from 'clsx';

// custom
import { CustomGrid } from '../../custom/CustomGrid';

// components
import { ValueSwitcherItem } from './ValueSwitcherItem';

// styles
import styles from './ValuesSwitcher.module.scss';

// types
import { ValueSwitcherProps } from './types';

const Component = <ValueType extends string | number, Label extends string = string>({
    values,
    activeValue,
    onValueChanged,
    itemClassName,
    variant = 'primary',
    width,
    className,
}: ValueSwitcherProps<ValueType, Label>) => {
    const [activeElementIndex, setActiveElementIndex] = useState<number | null>(null);
    const activeElementRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        setActiveElementIndex(values.findIndex(value => value.value === activeValue.value));
    }, [activeValue, values]);

    const renderValues = useMemo(
        () =>
            values.map((value, index) => (
                <ValueSwitcherItem<ValueType, Label>
                    key={value.id}
                    ref={value.id === activeValue.id ? activeElementRef : null}
                    index={index}
                    value={value}
                    variant={variant}
                    activeValue={activeValue}
                    onValueChanged={onValueChanged}
                    className={itemClassName}
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
            <CustomGrid className={styles.transition} style={style} container />
            {renderValues}
        </CustomGrid>
    );
};

const ValuesSwitcher = memo(Component) as typeof Component;

export default ValuesSwitcher;
