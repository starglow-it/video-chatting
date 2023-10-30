import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { AppBar, Toolbar } from '@mui/material';
import clsx from 'clsx';
import { useStore } from 'effector-react';
import {
    $isOwner,
    $meetingTemplateStore,
    toggleEditTemplateOpen,
    toggleMeetingInfoOpen,
} from 'src/store/roomStores';

import { useFormContext, useWatch } from 'react-hook-form';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { EditIcon } from 'shared-frontend/icons/OtherIcons/EditIcon';
import { InfoIcon } from 'shared-frontend/icons/OtherIcons/InfoIcon';
import styles from './MeetingHeader.module.scss';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { MonetizationIcon } from 'shared-frontend/icons/OtherIcons/MonetizationIcon';
import { ImageIcon } from 'shared-frontend/icons/OtherIcons/ImageIcon';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { useCallback } from 'react';

export const MeetingHeader = () => {
    const meetingTemplate = useStore($meetingTemplateStore);
    const isOwner = useStore($isOwner);

    const { control } = useFormContext();

    const companyName = useWatch({
        control,
        name: 'companyName',
    });

    const handleMeetingAction = useCallback(() => {
        if (isOwner) {
            toggleEditTemplateOpen();
        } else {
            toggleMeetingInfoOpen();
        }
    }, [isOwner]);
    return (
        <AppBar position="absolute" className={styles.container}>
            <Toolbar style={{ borderRadius: 0 }}>
                <ProfileAvatar
                    src={meetingTemplate?.user?.profileAvatar?.url}
                    width="45px"
                    height="45px"
                    userName={meetingTemplate.fullName}
                    isAcceptNoLogin={meetingTemplate.isAcceptNoLogin}
                />
                <CustomTypography
                    color="colors.white.primary"
                    className={clsx(
                        styles.companyNameTitle,
                        styles.withoutBoard,
                    )}
                    flex={1}
                    fontSize={13}
                    marginLeft={1}
                >
                    {isOwner ? companyName : meetingTemplate.companyName}
                </CustomTypography>
                <CustomPaper
                    variant="black-glass"
                    borderRadius={20}
                    className={styles.button}
                >
                    <ActionButton
                        variant="transparentBlack"
                        onAction={handleMeetingAction}
                        className={clsx(styles.button, {
                            [styles.inactive]: true,
                        })}
                        Icon={
                            isOwner ? (
                                <EditIcon
                                    width="22px"
                                    height="22px"
                                    className={styles.icon}
                                />
                            ) : (
                                <InfoIcon
                                    width="22px"
                                    height="22px"
                                    className={styles.icon}
                                />
                            )
                        }
                    />
                </CustomPaper>
                <CustomPaper
                    variant="black-glass"
                    borderRadius={20}
                    className={styles.button}
                >
                    <ActionButton
                        variant="transparentBlack"
                        // onAction={handleToggleMic}
                        className={clsx(styles.button, {
                            [styles.inactive]: true,
                        })}
                        Icon={
                            <ImageIcon
                                width="20px"
                                height="20px"
                                className={styles.icon}
                            />
                        }
                    />
                </CustomPaper>
            </Toolbar>
        </AppBar>
    );
};
