import React, { memo, useCallback, useMemo } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import { useRouter } from 'next/router';

// image
import Image from 'next/image';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// components
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import { ArrowLeftIcon } from '@library/icons/ArrowLeftIcon';

// stores
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';
import {
    $localUserStore,
    $isOwner,
    $meetingTemplateStore,
    $meetingUsersStore,
} from '../../../store';

// styles
import styles from './MeetingPreview.module.scss';

// types
import { MeetingAccessStatuses } from '../../../store/types';

const MeetingPreview = memo(() => {
    const router = useRouter();

    const meetingTemplate = useStore($meetingTemplateStore);
    const localUser = useStore($localUserStore);
    const isOwner = useStore($isOwner);

    const users = useStoreMap({
        store: $meetingUsersStore,
        keys: [localUser.id],
        fn: (state, [localUserId]) =>
            state.filter(
                user =>
                    user.id !== localUserId &&
                    user.accessStatus === MeetingAccessStatuses.InMeeting,
            ),
    });

    const handleLeaveMeeting = useCallback(() => {
        router.push(isOwner ? '/dashboard' : '/welcome');
    }, []);

    const renderCurrentUsers = useMemo(
        () =>
            users.map(
                user => (
                    <ProfileAvatar
                        key={user.id}
                        className={styles.userAvatar}
                        width="32px"
                        height="32px"
                        src={user?.profileAvatar}
                        userName={user.username}
                    />
                ),
                [],
            ),
        [users],
    );

    const previewImage = (meetingTemplate?.previewUrls || []).find(
        image => image.resolution === 240,
    );

    return (
        <CustomGrid
            container
            alignItems="center"
            className={styles.meetingPreviewWrapper}
            wrap="nowrap"
        >
            <CustomGrid
                container
                justifyContent="center"
                alignItems="center"
                onClick={handleLeaveMeeting}
                className={styles.backButton}
            >
                <ArrowLeftIcon width="32px" height="32px" />
            </CustomGrid>
            <CustomBox className={styles.imageWrapper}>
                <ConditionalRender condition={Boolean(previewImage?.url)}>
                    <Image
                        src={previewImage?.url}
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                    />
                </ConditionalRender>
            </CustomBox>
            <ProfileAvatar
                className={styles.profileAvatar}
                width="90px"
                height="90px"
                src={meetingTemplate?.user?.profileAvatar?.url || ''}
                userName={meetingTemplate.fullName}
            />
            <CustomGrid
                item
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                className={styles.textWrapper}
                flex="1 1 auto"
            >
                <CustomTypography
                    variant="h3bold"
                    color="colors.white.primary"
                    className={styles.companyName}
                >
                    {meetingTemplate.companyName}
                </CustomTypography>
                <ConditionalRender condition={!isOwner}>
                    <CustomTypography
                        color="colors.white.primary"
                        nameSpace="meeting"
                        translation="preview.invitedText"
                    />
                </ConditionalRender>
                <CustomTypography
                    variant="body1"
                    textAlign="center"
                    color="colors.white.primary"
                    className={styles.description}
                >
                    {meetingTemplate.description}
                </CustomTypography>
            </CustomGrid>
            <CustomGrid
                container
                alignSelf="flex-start"
                justifyContent="flex-end"
                className={styles.inMeetingAvatars}
                flex="1 0 auto"
            >
                {renderCurrentUsers}
            </CustomGrid>
        </CustomGrid>
    );
});

export { MeetingPreview };
