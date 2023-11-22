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
    audienceClassName?: string;
}>;

export const MeetingRoleGroup = forwardRef(
    (
        {
            defaultValue = MeetingRole.Participant,
            onChangeValue,
            className,
            audienceClassName,
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
                        <QuestionMarkIcon
                            width="13px"
                            height="13px"
                            className={styles.tooltip}
                        />
                    </CustomTooltip>
                </CustomGrid>

                <CustomGrid
                    className={clsx(styles.roleItem, audienceClassName)}
                >
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
                    <CustomTooltip
                        placement="top"
                        translation="role.tooltipLurker"
                        nameSpace="meeting"
                        popperClassName={styles.popperTooltip}
                        tooltipClassName={styles.containerTooltip}
                    >
                        <QuestionMarkIcon
                            width="13px"
                            height="13px"
                            className={styles.tooltip}
                        />
                    </CustomTooltip>
                </CustomGrid>
            </CustomGrid>
        );
    },
);
