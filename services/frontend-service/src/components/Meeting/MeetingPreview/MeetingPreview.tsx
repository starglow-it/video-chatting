import React, { memo, useCallback } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import { useRouter } from 'next/router';
import clsx from 'clsx';

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

// components
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import { ArrowLeftIcon } from 'shared-frontend/icons/OtherIcons/ArrowLeftIcon';
import { UsersAvatarsCounter } from '@library/common/UsersAvatarsCounter/UsersAvatarsCounter';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// shared
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

// stores
import { MeetingAccessStatusEnum } from 'shared-types';
import { $authStore } from '../../../store';
import {
    $isOwner,
    $localUserStore,
    $meetingTemplateStore,
    $meetingUsersStore,
} from '../../../store/roomStores';

// styles
import styles from './MeetingPreview.module.scss';

// types
import { MeetingUser } from '../../../store/types';

// const
import { clientRoutes } from '../../../const/client-routes';

const Component = () => {
    const router = useRouter();

    const meetingTemplate = useStore($meetingTemplateStore);
    const localUser = useStore($localUserStore);
    const isOwner = useStore($isOwner);
    const { isWithoutAuthen } = useStore($authStore);

    const { isMobile } = useBrowserDetect();

    const users = useStoreMap({
        store: $meetingUsersStore,
        keys: [localUser.id],
        fn: (state, [localUserId]) =>
            state.filter(
                user =>
                    user.id !== localUserId &&
                    user.accessStatus === MeetingAccessStatusEnum.InMeeting,
            ),
    });

    const handleLeaveMeeting = useCallback(async () => {
        await router.push(
            !isWithoutAuthen
                ? isOwner
                    ? clientRoutes.dashboardRoute
                    : clientRoutes.loginRoute
                : clientRoutes.loginRoute,
        );
    }, []);

    const previewImage = (meetingTemplate?.previewUrls || []).find(
        image => image.resolution === 240,
    );

    const renderUserAvatar = useCallback(
        (user: MeetingUser) => (
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
    );

    return (
        <CustomGrid>
            <CustomGrid
                container
                justifyContent="center"
                alignItems="center"
                onClick={handleLeaveMeeting}
                className={clsx(styles.backButton, {
                    [styles.mobile]: isMobile,
                })}
            >
                <ArrowLeftIcon
                    width={isMobile ? '22px' : '32px'}
                    height={isMobile ? '22px' : '32px'}
                />
                <ConditionalRender condition={isMobile}>
                    <CustomTypography
                        color="colors.black.primary"
                        nameSpace="meeting"
                        translation="rooms"
                        className={styles.text}
                    />
                </ConditionalRender>
            </CustomGrid>

            <CustomGrid
                container
                alignItems="center"
                className={styles.meetingPreviewWrapper}
                wrap="nowrap"
            >
                <CustomBox className={styles.imageWrapper}>
                    <ConditionalRender condition={Boolean(previewImage?.url)}>
                        <CustomImage
                            src={previewImage?.url || ''}
                            layout="fill"
                            objectFit="cover"
                            objectPosition="center"
                        />
                    </ConditionalRender>
                </CustomBox>
                <ProfileAvatar
                    className={clsx(styles.profileAvatar, {
                        [styles.mobile]: isMobile,
                    })}
                    width={isMobile ? '50px' : '90px'}
                    height={isMobile ? '50px' : '90px'}
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
                            textAlign="center"
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
                        {meetingTemplate.shortDescription ||
                            meetingTemplate.description}
                    </CustomTypography>
                </CustomGrid>
                <UsersAvatarsCounter<MeetingUser>
                    renderItem={renderUserAvatar}
                    className={styles.inMeetingAvatars}
                    users={users}
                />
            </CustomGrid>
        </CustomGrid>
    );
};

export const MeetingPreview = memo(Component);
