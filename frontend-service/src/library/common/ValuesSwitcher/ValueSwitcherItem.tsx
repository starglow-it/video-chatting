import {memo, useCallback, useEffect} from "react";

import {CustomGrid} from "@library/custom/CustomGrid/CustomGrid";
import {CustomTypography} from "@library/custom/CustomTypography/CustomTypography";

import styles from "./ValuesSwitcher.module.scss";

import { ValueSwitcherItemProps } from "./types";

const Component = ({ optionWidth, activeValue, value, index, onValueChanged, onUpdateActiveElement }: ValueSwitcherItemProps) => {
    useEffect(() => {
        if (activeValue.value === value.value) {
            onUpdateActiveElement(index * optionWidth);
        }
    }, [activeValue, value]);

    const handleChooseValue = useCallback(() => {
        onValueChanged(value);
    }, [onValueChanged]);

    return (
        <CustomGrid container alignItems="center" justifyContent="center" onClick={handleChooseValue} className={styles.item} style={{ '--width': `${optionWidth}px` }}>
            <CustomTypography color="colors.grayscale.normal" variant="body2">
                {value.label}
            </CustomTypography>
        </CustomGrid>
    )
}

export const ValueSwitcherItem = memo(Component);