import React, { memo, useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { MenuItem } from '@mui/material';

// components
import { PlusAddIcon } from '@library/icons/PlusAddIcon';

// custom
import { CustomDropdown } from '@library/custom/CustomDropdown/CustomDropdown';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { BusinessCategoryItem } from '@components/BusinessCategoryItem/BusinessCategoryItem';

// styles
import styles from './BusinessCategoriesSelect.module.scss';

// const
import { BUSINESS_CATEGORIES } from '../../const/businessCategories';

// types
import { BusinessCategoriesSelectProps } from './types';

const BusinessCategoriesSelect = memo(
    ({ nameSpace, translation }: BusinessCategoriesSelectProps) => {
        const { setValue, control, register } = useFormContext();

        const categoriesValue = useWatch({
            control,
            name: 'businessCategories',
        });

        const handleChange = useCallback(event => {
            setValue('businessCategories', event.target.value, {
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
            (selected: unknown): React.ReactNode => (
                <CustomScroll className={styles.tagsWrapper}>
                    <CustomGrid container gap={1}>
                        {selected.map(selectedKey => {
                            const selectedCategory = BUSINESS_CATEGORIES.find(
                                tag => tag.key === selectedKey,
                            )!;

                            if (selectedCategory) {
                                return (
                                    <BusinessCategoryItem
                                        key={selectedKey}
                                        category={selectedCategory}
                                    />
                                );
                            }

                            return <></>;
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
                labelId="businessCategories"
                multiple
                {...register('businessCategories')}
                value={categoriesValue}
                onChange={handleChange}
                renderValue={renderValues}
                IconComponent={PlusAddIcon}
                list={renderBusinessCategoriesList}
                classes={{
                    icon: styles.dropDownIcon
                }}
            />
        );
    },
);

export { BusinessCategoriesSelect };
