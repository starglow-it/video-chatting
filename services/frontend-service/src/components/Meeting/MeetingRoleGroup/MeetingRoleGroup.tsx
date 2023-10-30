import { CustomRadio } from '@library/custom/CustomRadio/CustomRadio';
import { FormControlLabel } from '@mui/material';
import clsx from 'clsx';
import { RadioIcon } from 'shared-frontend/icons/OtherIcons/RadioIcon';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import { forwardRef, useImperativeHandle, useState } from 'react';
import { MeetingRole } from 'shared-types';
import { PropsWithClassName } from 'shared-frontend/types';
import styles from './MeetingRoleGroup.module.scss';

type RoleGroupProps = PropsWithClassName<{
    defaultValue?: MeetingRole;
    onChangeValue?: (value: MeetingRole) => void;
}>;

export const MeetingRoleGroup = forwardRef(
    (
        {
            defaultValue = MeetingRole.Participant,
            onChangeValue,
            className,
        }: RoleGroupProps,
        ref,
    ) => {
        const [value, setValue] = useState<MeetingRole>(defaultValue);

        useImperativeHandle(ref, () => ({
            getValue: () => value,
        }));

        const changeValue = (newValue: MeetingRole) => {
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
                    checked={value === MeetingRole.Participant}
                    label="Participants"
                    classes={{
                        root: clsx(styles.label, {
                            [styles.active]: value === MeetingRole.Participant,
                        }),
                    }}
                    onClick={() => changeValue(MeetingRole.Participant)}
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
                    onClick={() => changeValue(MeetingRole.Lurker)}
                    label="Audience"
                    classes={{
                        root: clsx(styles.label, {
                            [styles.active]: value === MeetingRole.Lurker,
                        }),
                    }}
                    checked={value === MeetingRole.Lurker}
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
