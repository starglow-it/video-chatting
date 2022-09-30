import { memo, useCallback, useEffect } from 'react';

import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

import styles from './ValuesSwitcher.module.scss';

import { ValueSwitcherItemProps } from './types';

const Component = ({
    optionWidth,
    activeValue,
    value,
    index,
    onValueChanged,
    onUpdateActiveElement,
    variant = 'primary',
}: ValueSwitcherItemProps) => {
    useEffect(() => {
        if (activeValue.value === value.value) {
            onUpdateActiveElement(index * optionWidth);
        }
    }, [activeValue, value]);

    const handleChooseValue = useCallback(() => {
        onValueChanged(value);
    }, [onValueChanged]);

    const typographyColor =
        variant === 'primary' ? 'colors.grayscale.normal' : 'colors.white.normal';

    return (
        <CustomGrid
            container
            alignItems="center"
            justifyContent="center"
            onClick={handleChooseValue}
            className={styles.item}
            style={{ '--width': `${optionWidth}px` }}
        >
            <CustomTypography color={typographyColor} variant="body2">
                {value.label}
            </CustomTypography>
        </CustomGrid>
    );
};

export const ValueSwitcherItem = memo(Component);
