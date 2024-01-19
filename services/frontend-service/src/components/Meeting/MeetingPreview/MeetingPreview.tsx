import { memo, useCallback } from 'react';
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

// stores
import { MeetingAccessStatusEnum, MeetingRole } from 'shared-types';
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

const Component = ({ isAllowBack = true }) => {
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
                    user.accessStatus === MeetingAccessStatusEnum.InMeeting &&
                    user.meetingRole !== MeetingRole.Audience,
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
        <CustomGrid width="100%">
            <ConditionalRender condition={isAllowBack}>
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
            </ConditionalRender>
            <ConditionalRender condition={!isMobile}>
                <CustomGrid
                    container
                    alignItems="center"
                    className={clsx(styles.meetingPreviewWrapper, {
                        [styles.mobile]: isMobile,
                    })}
                    wrap="nowrap"
                >
                    <CustomBox className={styles.imageWrapper} />
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
                            fontSize={isMobile ? 15 : 24}
                            lineHeight={isMobile ? '20px' : '36px'}
                        >
                            {meetingTemplate.companyName}
                        </CustomTypography>
                        <ConditionalRender condition={!isOwner}>
                            <CustomTypography
                                textAlign="center"
                                color="colors.white.primary"
                                nameSpace="meeting"
                                translation="preview.invitedText"
                                fontSize={isMobile ? 12 : 16}
                                lineHeight={isMobile ? '18px' : '24px'}
                            />
                        </ConditionalRender>
                        <CustomTypography
                            variant="body1"
                            textAlign="center"
                            color="colors.white.primary"
                            className={styles.description}
                            fontSize={isMobile ? 12 : 16}
                            lineHeight={isMobile ? '18px' : '24px'}
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
            </ConditionalRender>
        </CustomGrid>
    );
};

export const MeetingPreview = memo(Component);
