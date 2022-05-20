import React, { ForwardedRef, forwardRef, memo, useMemo } from 'react';

import { FormControl, InputLabel, Select } from '@mui/material';

import { CustomDropdownProps } from './types';

import styles from './CustomDropdown.module.scss';

import { useLocalization } from '../../../hooks/useTranslation';
import { ArrowIcon } from '@library/icons/ArrowIcon';
import { ErrorMessage } from '@library/common/ErrorMessage/ErrorMessage';

const Component = (
    {
        list,
        selectId,
        labelId,
        nameSpace,
        translation,
        renderValue,
        placeholder,
        IconComponent,
        error,
        ...rest
    }: CustomDropdownProps,
    ref: ForwardedRef<HTMLSelectElement>,
) => {
    const t = useLocalization(nameSpace);

    const label = useMemo(() => {
        return translation ? t.translation(translation) : '';
    }, [translation]);

    return (
        <FormControl className={styles.select} error={Boolean(error)}>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select
                ref={ref}
                labelId={labelId}
                id={selectId}
                label={label}
                renderValue={renderValue}
                inputProps={{
                    className: styles.selectInput,
                    placeholder: placeholder,
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
                IconComponent={IconComponent || ArrowIcon}
                {...rest}
            >
                {list}
            </Select>
            {error && <ErrorMessage className={styles.errorContainer} error={error} />}
        </FormControl>
    );
};

const CustomDropdown = memo(
    forwardRef(Component),
);

export { CustomDropdown };
