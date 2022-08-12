import React, { memo, useMemo, useCallback, useState } from 'react';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import { ValueSwitcherItem } from './ValueSwitcherItem';

// styles
import styles from './ValuesSwitcher.module.scss';

// types
import { ValueSwitcherProps } from './types';

const Component = ({ optionWidth, values, activeValue, onValueChanged }: ValueSwitcherProps) => {
    const [left, setLeft] = useState(0);

    const handleUpdateActiveElement = useCallback((left: number) => {
        setLeft(left);
    }, []);

    const renderValues = useMemo(
        () =>
            values.map((value, index) => (
                <ValueSwitcherItem
                    key={value.id}
                    index={index}
                    value={value}
                    optionWidth={optionWidth}
                    activeValue={activeValue}
                    onValueChanged={onValueChanged}
                    onUpdateActiveElement={handleUpdateActiveElement}
                />
            )),
        [values, activeValue, onValueChanged],
    );

    const style = useMemo(
        () => ({ '--left': `${left}px`, '--width': `${optionWidth}px` } as React.CSSProperties),
        [left],
    );

    return (
        <CustomGrid container wrap="nowrap" className={styles.wrapper}>
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

export const ValuesSwitcher = memo<ValueSwitcherProps>(Component);
