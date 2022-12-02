import React, { memo, useCallback } from 'react';
import { Controller } from 'react-hook-form';
import { Autocomplete, AutocompleteRenderInputParams, FilterOptionsState } from '@mui/material';
import { matchSorter } from 'match-sorter';
import clsx from "clsx";

// icons
import { RoundCloseIcon } from '../../../icons';

// custom
import {CustomChip, CustomGrid, CustomInput} from '../../custom';

// types
import { CustomAutocompleteProps } from './types';

import styles from './CustomAutocomplete.module.scss';

const Component = <ValueType extends { label: string; key: string; value: string }>({
    name,
    control,
    error,
    options,
    withInputValue,
    errorComponent,
    ...props
}: CustomAutocompleteProps<ValueType>) => {
    const renderInput = useCallback(
        (inputProps: AutocompleteRenderInputParams, value: string) => (
            <CustomGrid container direction="column">
                <CustomInput value={value} color="secondary" error={error} {...inputProps} />
                {errorComponent}
            </CustomGrid>
        ),
        [error, errorComponent],
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
                        tagValue.map((option, index) => {
                            const tagProps = getTagProps({ index })

                            return (
                                <CustomChip
                                    variant="custom-squared"
                                    label={option.label}
                                    deleteIcon={<RoundCloseIcon width="22px" height="22px" />}
                                    size="small"
                                    {...tagProps}
                                    className={clsx(styles.tag, tagProps.className)}
                                />
                            )
                        })
                    }
                    onChange={(_, data) => {
                        onChange(withInputValue ? data : data?.filter(tag => typeof tag !== 'string'));
                    }}
                    filterOptions={filterOptions}
                    options={options}
                    {...props}
                    value={value}
                    {...restField}
                />
            )}
        />
    );
};

const CustomAutocomplete = memo(Component) as typeof Component;

export default CustomAutocomplete;
