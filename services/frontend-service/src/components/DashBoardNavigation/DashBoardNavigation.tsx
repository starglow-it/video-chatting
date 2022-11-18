import React, { memo, useCallback } from 'react';
import { useStore } from 'effector-react';
import Router, { useRouter } from 'next/router';
import clsx from 'clsx';

// custom
import { CustomGrid } from 'shared-frontend/library';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import { CustomDivider } from 'shared-frontend/library';

// icons
import { TemplatesIcon } from 'shared-frontend/icons';
import { ExitIcon } from 'shared-frontend/icons';
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';

// stores
import { $profileStore, logoutUserFx } from '../../store';

// styles
import styles from './DashBoardNavigation.module.scss';

// const
import { clientRoutes, dashboardRoute, profileRoute } from '../../const/client-routes';

const Component = () => {
    const profileState = useStore($profileStore);
    const router = useRouter();

    const handleLogout = useCallback(async () => {
        await logoutUserFx();

        await Router.push(clientRoutes.loginRoute);
    }, []);

    const isTemplatesLinkActive = router.pathname === dashboardRoute;

    const isProfilePageActive = router.pathname === profileRoute;

    const handleProfilePage = useCallback(async () => {
        await router.push(profileRoute);
    }, []);

    const handleTemplatesPage = useCallback(async () => {
        await router.push(dashboardRoute);
    }, []);

    return (
        <CustomPaper className={styles.dashboardNavigation}>
            <CustomGrid
                container
                alignItems="center"
                justifyContent="center"
                direction="column"
                className={styles.iconsWrapper}
                gap={1}
            >
                <CustomTooltip nameSpace="profile" translation="pages.profile" placement="right">
                    <ProfileAvatar
                        onClick={handleProfilePage}
                        className={clsx(styles.profileImage, styles.linkIcon, {
                            [styles.activeProfile]: isProfilePageActive,
                        })}
                        src={profileState?.profileAvatar?.url}
                        width="28px"
                        height="28px"
                        userName={profileState.fullName}
                    />
                </CustomTooltip>

                <CustomDivider className={styles.divider} light />

                <CustomTooltip nameSpace="profile" translation="pages.templates" placement="right">
                    <TemplatesIcon
                        onClick={handleTemplatesPage}
                        width="28px"
                        height="28px"
                        className={clsx(styles.linkIcon, {
                            [styles.activeIcon]: isTemplatesLinkActive,
                        })}
                    />
                </CustomTooltip>

                <CustomTooltip nameSpace="profile" translation="pages.logout" placement="right">
                    <ExitIcon
                        onClick={handleLogout}
                        className={styles.icon}
                        width="28px"
                        height="28px"
                    />
                </CustomTooltip>
            </CustomGrid>
        </CustomPaper>
    );
};

export const DashBoardNavigation = memo(Component);
