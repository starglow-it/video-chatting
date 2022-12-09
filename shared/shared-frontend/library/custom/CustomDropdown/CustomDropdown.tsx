import React, { ForwardedRef, forwardRef, memo } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from "@mui/material/Select";

// common
import { RoundArrowIcon } from '../../../icons/RoundIcons/RoundArrowIcon';

// types
import { CustomDropdownProps } from './CustomDropdown.types';

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
        renderValue,
        placeholder,
        IconComponent,
        label,
        error,
        variant = 'primary',
        ...rest
    } = props;

    return (
        <FormControl className={styles.select} error={error}>
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
        </FormControl>
    );
};

const CustomDropdown = memo(forwardRef(Component));

export default CustomDropdown;
