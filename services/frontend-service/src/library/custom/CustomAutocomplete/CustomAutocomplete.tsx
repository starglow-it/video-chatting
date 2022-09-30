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
import { CustomAutocompleteProps } from '@library/custom/CustomAutocomplete/types';

const Component = ({ name, control, error, ...props }: CustomAutocompleteProps) => {
    const renderInput = useCallback(
        (inputProps: AutocompleteRenderInputParams, value: string) => (
            <CustomInput value={value} color="secondary" error={error} {...inputProps} />
        ),
        [error],
    );

    const filterOptions = useCallback(
        (options: string[], { inputValue }: FilterOptionsState<string>) =>
            matchSorter<string>(options, inputValue, {
                threshold: matchSorter.rankings.STARTS_WITH,
            }),
        [],
    );

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange } }) => (
                <Autocomplete
                    renderInput={inputProps => renderInput(inputProps, value)}
                    renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => (
                            <CustomChip
                                variant="custom-squared"
                                label={option}
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
                />
            )}
        />
    );
};

export const CustomAutocomplete = memo<CustomAutocompleteProps>(Component);
