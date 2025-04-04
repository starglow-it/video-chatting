import React, { memo, useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { MenuItem } from '@mui/material';

// library
import { PlusAddIcon } from 'shared-frontend/icons/OtherIcons/PlusAddIcon';

// custom
import { CustomDropdown } from '@library/custom/CustomDropdown/CustomDropdown';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';

// components

// const
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { TagItem } from 'shared-frontend/library/common/TagItem';
import { LANGUAGES_TAGS } from '../../const/profile/languages';

// types
import { LanguagesSelectProps } from './types';

// styles
import styles from './LanguagesSelect.module.scss';

const LanguagesSelect = memo(
    ({ nameSpace, translation }: LanguagesSelectProps) => {
        const { setValue, control, register } = useFormContext();

        const registerData = register('languages');

        const languagesValue = useWatch({
            control,
            name: 'languages',
        });

        const handleChange = useCallback((event: any) => {
            setValue('languages', event.target.value, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }, []);

        const renderLanguages = useMemo(
            () =>
                LANGUAGES_TAGS.map(name => (
                    <MenuItem key={name.key} value={name.key}>
                        {name.value}
                    </MenuItem>
                )),
            [],
        );

        const renderValues = useCallback(
            (selected: any): React.ReactNode => (
                <CustomScroll className={styles.languagesWrapper}>
                    <CustomGrid container gap={1}>
                        {selected.map((selectedKey: any) => {
                            const selectedLanguage = LANGUAGES_TAGS.find(
                                tag => tag.key === selectedKey,
                            );

                            return (
                                <TagItem
                                    key={selectedKey}
                                    label={
                                        <CustomTypography>
                                            {selectedLanguage?.value}
                                        </CustomTypography>
                                    }
                                />
                            );
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
                selectId="languagesSelect"
                labelId="languages"
                multiple
                {...registerData}
                value={languagesValue}
                onChange={handleChange}
                renderValue={renderValues}
                IconComponent={PlusAddIcon}
                list={renderLanguages}
                classes={{
                    icon: styles.dropDownIcon,
                }}
            />
        );
    },
);

export { LanguagesSelect };
