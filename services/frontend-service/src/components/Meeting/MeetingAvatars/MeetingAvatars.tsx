import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { useStore } from 'effector-react';
import {
    $avatarsMeetingStore,
    getAvatarsMeetingFx,
    setAvatarTmpEvent,
} from 'src/store/roomStores/meeting/meetingAvatar/model';
import { CircularProgress } from '@mui/material';
import { $localUserStore, updateLocalUserEvent } from 'src/store/roomStores';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { $authStore } from 'src/store';
import styles from './MeetingAvatars.module.scss';
import { AvatarItem } from './AvatarItem';

export const MeetingAvatars = ({
    devicesSettingsDialog = false,
}: {
    devicesSettingsDialog: boolean;
}) => {
    const isLoading = useStore(getAvatarsMeetingFx.pending);
    const localUser = useStore($localUserStore);
    const { isAuthenticated } = useStore($authStore);
    const {
        avatar: { list },
        avatarTmp,
    } = useStore($avatarsMeetingStore);

    const handleSelectAvatar = (id: string) => {
        if (devicesSettingsDialog) {
            setAvatarTmpEvent(id);
        } else {
            updateLocalUserEvent({
                meetingAvatarId: id,
            });
        }
    };

    const renderAvatars = () => {
        return list.map(item => (
            <AvatarItem
                key={item.id}
                item={item}
                onSelect={handleSelectAvatar}
                isActive={
                    devicesSettingsDialog
                        ? avatarTmp === item.id
                        : item.id === localUser.meetingAvatarId
                }
                isAuthenticated={isAuthenticated}
            />
        ));
    };

    if (isLoading) return <CircularProgress variant="determinate" />;

    return (
        <CustomGrid className={styles.container}>
            <CustomGrid className={styles.header}>
                <CustomTypography
                    fontSize={16}
                    fontWeight={600}
                    marginBottom="10px"
                >
                    Replace with Avatar
                </CustomTypography>
            </CustomGrid>
            <CustomGrid className={styles.main}>{renderAvatars()}</CustomGrid>
        </CustomGrid>
    );
};
