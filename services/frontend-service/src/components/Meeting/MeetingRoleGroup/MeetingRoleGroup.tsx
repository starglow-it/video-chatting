import { CustomRadio } from '@library/custom/CustomRadio/CustomRadio';
import { FormControlLabel } from '@mui/material';
import clsx from 'clsx';
import { RadioIcon } from 'shared-frontend/icons/OtherIcons/RadioIcon';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { QuestionMarkIcon } from 'shared-frontend/icons/OtherIcons/QuestionMarkIcon';

import { forwardRef, useImperativeHandle, useState } from 'react';
import { MeetingRole } from 'shared-types';
import { PropsWithClassName } from 'shared-frontend/types';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import styles from './MeetingRoleGroup.module.scss';

type RoleGroupProps = PropsWithClassName<{
    defaultValue?: MeetingRole;
    onChangeValue?: (value: MeetingRole) => void;
    isBlockAudience?: boolean;
}>;

export const MeetingRoleGroup = forwardRef(
    (
        {
            defaultValue = MeetingRole.Participant,
            onChangeValue,
            className,
            isBlockAudience = false,
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
                id="selectGuests"
                display="flex"
                alignItems="center"
                marginBottom={2}
                justifyContent="flex-start"
                width="100%"
                className={className}
                gap={2}
            >
                <CustomGrid className={styles.roleItem}>
                    <FormControlLabel
                        checked={value === MeetingRole.Participant}
                        label="Participants"
                        classes={{
                            root: clsx(styles.label, {
                                [styles.active]:
                                    value === MeetingRole.Participant,
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
                    <CustomTooltip
                        placement="top"
                        translation="role.tooltipParticipant"
                        nameSpace="meeting"
                        popperClassName={styles.popperTooltip}
                        tooltipClassName={styles.containerTooltip}
                    >
                        <div className={clsx(styles.tooltip, styles.exclamationMark)}>!</div>
                    </CustomTooltip>
                </CustomGrid>

                <CustomGrid
                    className={clsx(styles.roleItem, {
                        [styles.block]: isBlockAudience,
                    })}
                >
                    <FormControlLabel
                        onClick={() => changeValue(MeetingRole.Audience)}
                        label="Audience"
                        classes={{
                            root: clsx(styles.label, {
                                [styles.active]: value === MeetingRole.Audience,
                            }),
                        }}
                        checked={value === MeetingRole.Audience}
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
                    <CustomTooltip
                        placement="top"
                        translation="role.tooltipAudience"
                        nameSpace="meeting"
                        popperClassName={styles.popperTooltip}
                        tooltipClassName={styles.containerTooltip}
                    >
                        <div className={clsx(styles.tooltip, styles.exclamationMark)}>!</div>
                    </CustomTooltip>
                </CustomGrid>
            </CustomGrid>
        );
    },
);
