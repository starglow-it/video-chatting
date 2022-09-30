import React, { memo, useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { MenuItem } from '@mui/material';

// components
import { PlusAddIcon } from '@library/icons/PlusAddIcon';

// custom
import { CustomDropdown } from '@library/custom/CustomDropdown/CustomDropdown';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';

// components
import { BusinessCategoryItem } from '@components/BusinessCategoryItem/BusinessCategoryItem';

// styles
import styles from './BusinessCategoriesSelect.module.scss';

// const
import { BUSINESS_CATEGORIES } from '../../const/businessCategories';

// types
import { BusinessCategoriesSelectProps } from './types';

const Component = ({ nameSpace, translation, formKey }: BusinessCategoriesSelectProps) => {
    const { setValue, control, register } = useFormContext();

    const categoriesValue = useWatch({
        control,
        name: formKey,
    });

    const registerData = register(formKey);

    const handleChange = useCallback((event: SelectChangeEvent<string[]>) => {
        setValue(formKey, event.target.value, {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, []);

    const renderBusinessCategoriesList = useMemo(
        () =>
            BUSINESS_CATEGORIES.map(name => (
                <MenuItem key={name.key} value={name.key}>
                    <CustomTypography transform="capitalize">{name.value}</CustomTypography>
                </MenuItem>
            )),
        [],
    );

    const renderValues = useCallback(
        (selected: string[]): React.ReactNode => (
            <CustomScroll className={styles.tagsWrapper}>
                <CustomGrid container gap={1}>
                    {selected.map(selectedKey => {
                        const selectedCategory = BUSINESS_CATEGORIES.find(
                            tag => tag.key === selectedKey,
                        );

                        if (selectedCategory) {
                            return (
                                <BusinessCategoryItem
                                    key={selectedKey}
                                    category={selectedCategory}
                                />
                            );
                        }

                        return null;
                    })}
                </CustomGrid>
            </CustomScroll>
        ),
        [],
    );

    return (
        <CustomDropdown
            nameSpace={nameSpace}
            translation={translation}
            selectId="businessCategoriesSelect"
            labelId={formKey}
            multiple
            {...registerData}
            value={categoriesValue}
            onChange={handleChange}
            renderValue={renderValues}
            IconComponent={PlusAddIcon}
            list={renderBusinessCategoriesList}
            classes={{
                icon: styles.dropDownIcon,
            }}
        />
    );
};

export const BusinessCategoriesSelect = memo(Component);
