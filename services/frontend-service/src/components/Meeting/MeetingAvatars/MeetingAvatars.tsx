import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { useStore } from 'effector-react';
import {
    $avatarsMeetingStore,
    getAvatarsMeetingFx,
} from 'src/store/roomStores/meeting/meetingAvatar/model';
import { CircularProgress } from '@mui/material';
import { $localUserStore, updateLocalUserEvent } from 'src/store/roomStores';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import styles from './MeetingAvatars.module.scss';
import { AvatarItem } from './AvatarItem';

export const MeetingAvatars = () => {
    const isLoading = useStore(getAvatarsMeetingFx.pending);
    const localUser = useStore($localUserStore);
    const {
        avatar: { list },
    } = useStore($avatarsMeetingStore);

    const handleSelectAvatar = (id: string) => {
        updateLocalUserEvent({
            meetingAvatarId: id,
        });
    };

    const renderAvatars = () => {
        return list.map(item => (
            <AvatarItem
                key={item.id}
                item={item}
                onSelect={handleSelectAvatar}
                isActive={item.id === localUser.meetingAvatarId}
            />
        ));
    };

    if (isLoading) return <CircularProgress variant="determinate" />;

    return (
        <CustomGrid className={styles.container}>
            <CustomGrid className={styles.header}>
                <CustomTypography fontSize={15}>
                    Replace with Avatar
                </CustomTypography>
            </CustomGrid>
            <CustomGrid className={styles.main}>{renderAvatars()}</CustomGrid>
        </CustomGrid>
    );
};
