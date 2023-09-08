import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { useStore, useStoreMap } from 'effector-react';
import {
    $avatarsMeetingStore,
    getAvatarsMeetingFx,
    setAvatarTmpEvent,
} from 'src/store/roomStores/meeting/meetingAvatar/model';
import { CircularProgress } from '@mui/material';
import {
    $localUserStore,
    setIsAudioActiveEvent,
    setIsCameraActiveEvent,
    updateLocalUserEvent,
} from 'src/store/roomStores';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { $authStore } from 'src/store';
import { MeetingAvatarRole } from 'shared-types';
import { registerRoute } from 'src/const/client-routes';
import styles from './MeetingAvatars.module.scss';
import { AvatarItem } from './AvatarItem';
import config from '../../../const/config';

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
    const avatarsAccess = useStoreMap({
        store: $avatarsMeetingStore,
        keys: [],
        fn: ({ avatar }) =>
            avatar.list.filter(
                item =>
                    item.roles.includes(MeetingAvatarRole.LoggedIn) &&
                    item.roles.length === 1,
            ),
    });
    const avatarsFree = useStoreMap({
        store: $avatarsMeetingStore,
        keys: [],
        fn: ({ avatar }) =>
            avatar.list.filter(item =>
                item.roles.includes(MeetingAvatarRole.NoLogin),
            ),
    });

    const handleSelectAvatar = (id: string) => {
        if (devicesSettingsDialog) {
            setAvatarTmpEvent(avatarTmp === id ? '' : id);
        } else {
            updateLocalUserEvent({
                meetingAvatarId: id === localUser.meetingAvatarId ? '' : id,
                cameraStatus: 'active',
            });
            setIsCameraActiveEvent(false);
        }
    };

    const handleStartedEmail = () => {
        window.open(`${config.frontendUrl}${registerRoute}`);
    };

    const renderAvatars = () => {
        return (
            <CustomGrid className={styles.list}>
                {list.map(item => (
                    <AvatarItem
                        key={item.id}
                        item={item}
                        onSelect={handleSelectAvatar}
                        isActive={
                            devicesSettingsDialog
                                ? avatarTmp === item.id
                                : item.id === localUser.meetingAvatarId
                        }
                        disabled={false}
                    />
                ))}
            </CustomGrid>
        );
    };

    const renderAvatarsNoLogin = () => {
        return (
            <>
                <CustomGrid className={styles.list}>
                    {list.map(item => (
                        <AvatarItem
                            key={item.id}
                            item={item}
                            onSelect={handleSelectAvatar}
                            isActive={
                                devicesSettingsDialog
                                    ? avatarTmp === item.id
                                    : item.id === localUser.meetingAvatarId
                            }
                            disabled={false}
                        />
                    ))}
                </CustomGrid>
                <CustomTypography
                    nameSpace="meeting"
                    translation="unlockAccess.link"
                    onClick={handleStartedEmail}
                    className={styles.unlockTitle}
                    textAlign="center"
                />
                <CustomTypography
                    nameSpace="meeting"
                    translation="unlockAccess.note"
                    textAlign="center"
                    fontSize={12}
                />
                <CustomGrid className={styles.list}>
                    {avatarsAccess.map(item => (
                        <AvatarItem
                            key={item.id}
                            item={item}
                            onSelect={handleSelectAvatar}
                            isActive={false}
                            disabled
                        />
                    ))}
                </CustomGrid>
            </>
        );
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
            <CustomGrid className={styles.main}>
                {!isAuthenticated ? renderAvatarsNoLogin() : renderAvatars()}
            </CustomGrid>
        </CustomGrid>
    );
};
