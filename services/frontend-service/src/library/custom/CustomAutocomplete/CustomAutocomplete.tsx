import React, { memo, useCallback } from 'react';
import { Controller } from 'react-hook-form';
import { Autocomplete, AutocompleteRenderInputParams, FilterOptionsState } from '@mui/material';
import { matchSorter } from 'match-sorter';

// icons
import { RoundCloseIcon } from '@library/icons/RoundIcons/RoundCloseIcon';

// custom
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomChip } from '@library/custom/CustomChip/CustomChip';

// types
import { CustomAutocompleteProps } from './types';

import styles from './CustomAutocomplete.module.scss';

const Component = <ValueType extends { label: string; key: string; value: string }>({
    name,
    control,
    error,
    ...props
}: CustomAutocompleteProps<ValueType>) => {
    const renderInput = useCallback(
        (inputProps: AutocompleteRenderInputParams, value: string) => (
            <CustomInput value={value} color="secondary" error={error} {...inputProps} />
        ),
        [error],
    );

    const filterOptions = useCallback(
        (options: ValueType[], { inputValue }: FilterOptionsState<ValueType>) =>
            matchSorter<ValueType>(options, inputValue, {
                keys: ['label'],
                threshold: matchSorter.rankings.STARTS_WITH,
            }),
        [],
    );

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange, ...restField } }) => (
                <Autocomplete<ValueType>
                    classes={{
                        root: styles.root,
                        input: styles.input,
                    }}
                    renderInput={inputProps => renderInput(inputProps, value)}
                    renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => (
                            <CustomChip
                                variant="custom-squared"
                                label={option.label}
                                deleteIcon={<RoundCloseIcon width="22px" height="22px" />}
                                size="small"
                                {...getTagProps({ index })}
                            />
                        ))
                    }
                    onChange={(_, data) => {
                        onChange(data);
                    }}
                    filterOptions={filterOptions}
                    {...props}
                    value={value}
                    {...restField}
                />
            )}
        />
    );
};

export const CustomAutocomplete = memo(Component) as typeof Component;
