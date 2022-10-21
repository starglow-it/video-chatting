import React, { ForwardedRef, forwardRef, memo, useMemo } from 'react';
import { FormControl, InputLabel, Select } from '@mui/material';

// hooks
import { useLocalization } from '@hooks/useTranslation';

// common
import { RoundArrowIcon } from '@library/icons/RoundIcons/RoundArrowIcon';
import { ErrorMessage } from '@library/common/ErrorMessage/ErrorMessage';

// types
import { CustomDropdownProps } from './types';

// styles
import styles from './CustomDropdown.module.scss';

const Component: React.FunctionComponent<CustomDropdownProps> = (
    props: CustomDropdownProps,
    ref: ForwardedRef<HTMLSelectElement>,
) => {
    const {
        list,
        selectId,
        labelId,
        nameSpace,
        translation,
        renderValue,
        placeholder,
        IconComponent,
        error,
        variant = 'primary',
        ...rest
    } = props;

    const t = useLocalization(nameSpace);

    const label = useMemo(() => (translation ? t.translation(translation) : ''), [translation]);

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
                    placeholder,
                }}
                MenuProps={{
                    classes: {
                        paper: styles.paper,
                    },
                    PopoverClasses: {
                        root: styles.popover,
                    },
                    PaperProps: {
                        style: {
                            maxHeight: 400,
                        },
                    },
                }}
                IconComponent={IconComponent || RoundArrowIcon}
                className={styles[variant]}
                {...rest}
            >
                {list}
            </Select>
            {error && <ErrorMessage className={styles.errorContainer} error={error} />}
        </FormControl>
    );
};

const CustomDropdown = memo(forwardRef(Component));

export { CustomDropdown };
