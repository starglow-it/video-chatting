import React, {ForwardedRef, forwardRef, memo, useMemo} from 'react';

import { FormControl, InputLabel, Select } from '@mui/material';

import { CustomDropdownProps } from './types';

import styles from './CustomDropdown.module.scss';

import { useLocalization } from '../../../hooks/useTranslation';

const Component = (
    {
        list,
        selectId,
        labelId,
        nameSpace,
        translation,
        renderValue,
        ...rest
    }: CustomDropdownProps,
    ref: ForwardedRef<HTMLSelectElement>,
) => {
    const t = useLocalization(nameSpace);

    const label = useMemo(() => {
        return translation ? t.translation(translation) : '';
    }, [translation]);

    return (
        <FormControl className={styles.select}>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select
                ref={ref}
                labelId={labelId}
                id={selectId}
                label={label}
                renderValue={renderValue}
                inputProps={{
                    className: styles.selectInput,
                }}
                MenuProps={{
                    PopoverClasses: {
                        root: styles.popover,
                    },
                    PaperProps: {
                        style: {
                            maxHeight: 400,
                        },
                    },
                }}
                {...rest}
            >
                {list}
            </Select>
        </FormControl>
    );
};

const CustomDropdown = memo<CustomDropdownProps>(forwardRef<HTMLSelectElement, CustomDropdownProps>(Component));

export { CustomDropdown };
