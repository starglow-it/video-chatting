import { CustomRadio } from '@library/custom/CustomRadio/CustomRadio';
import { FormControlLabel } from '@mui/material';
import clsx from 'clsx';
import { RadioIcon } from 'shared-frontend/icons/OtherIcons/RadioIcon';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from './MeetingRoleGroup.module.scss';

type RadioValue = 'participants' | 'lurkers';

type RoleGroupProps = {
    defaultValue?: RadioValue;
    onChangeValue?: (value: RadioValue) => void;
    className?: string;
};

export const MeetingRoleGroup = forwardRef(
    (
        { defaultValue = 'participants', onChangeValue, className }: RoleGroupProps,
        ref,
    ) => {
        const [value, setValue] = useState<RadioValue>(defaultValue);

        useImperativeHandle(ref, () => ({
            getValue: () => value,
        }));

        const changeValue = (newValue: RadioValue) => {
            setValue(newValue);
            onChangeValue?.(newValue);
        };

        return (
            <CustomGrid
                display="flex"
                alignItems="center"
                marginBottom={2}
                justifyContent="flex-start"
                width="100%"
                className={className}
            >
                <FormControlLabel
                    checked={value === 'participants'}
                    label="Participants"
                    classes={{
                        root: clsx(styles.label, {
                            [styles.active]: value === 'participants',
                        }),
                    }}
                    onClick={() => changeValue('participants')}
                    control={
                        <CustomRadio
                            icon={
                                <RadioIcon
                                    className={styles.icon}
                                    width="22px"
                                    height="22px"
                                />
                            }
                            checkedIcon={
                                <RadioIcon
                                    checked
                                    className={styles.icon}
                                    width="22px"
                                    height="22px"
                                />
                            }
                        />
                    }
                />
                <FormControlLabel
                    onClick={() => changeValue('lurkers')}
                    label="Lurkers"
                    classes={{
                        root: clsx(styles.label, {
                            [styles.active]: value === 'lurkers',
                        }),
                    }}
                    checked={value === 'lurkers'}
                    control={
                        <CustomRadio
                            icon={
                                <RadioIcon
                                    className={styles.icon}
                                    width="22px"
                                    height="22px"
                                />
                            }
                            checkedIcon={
                                <RadioIcon
                                    checked
                                    className={styles.icon}
                                    width="22px"
                                    height="22px"
                                />
                            }
                        />
                    }
                />
            </CustomGrid>
        );
    },
);
