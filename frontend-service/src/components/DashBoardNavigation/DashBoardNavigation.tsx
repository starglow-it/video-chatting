import React, { memo, useCallback, useMemo } from 'react';
import { useStore } from 'effector-react';
import Router, { useRouter } from 'next/router';
import clsx from 'clsx';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import { CustomDivider } from '@library/custom/CustomDivider/CustomDivider';

// icons
// import { DiscoveryIcon } from '@library/icons/DiscoveryIcon';
import { TemplatesIcon } from '@library/icons/TemplatesIcon';
import { ExitIcon } from '@library/icons/ExitIcon';
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';

// stores
import { $profileStore } from '../../store/profile';
import { logoutUserFx } from '../../store/auth';

// styles
import styles from './DashBoardNavigation.module.scss';

const DashBoardNavigation = memo(() => {
    const profileState = useStore($profileStore);
    const router = useRouter();

    const handleLogout = useCallback(async () => {
        await logoutUserFx();

        await Router.push('/login');
    }, []);

    const isTemplatesLinkActive = useMemo(
        () => router.pathname === '/dashboard',
        [router.pathname],
    );

    const isProfilePageActive = useMemo(
        () => router.pathname === '/dashboard/profile',
        [router.pathname],
    );

    /*
    const isDiscoveryLinkActive = useMemo(
        () => router.pathname === '/dashboard/discovery',
        [router.pathname],
    );
     */

    const handleProfilePage = useCallback(() => {
        router.push('/dashboard/profile');
    }, []);

    const handleTemplatesPage = useCallback(() => {
        router.push('/dashboard');
    }, []);

    /* const handleDiscoveryPage = useCallback(() => {
        router.push('/dashboard/discovery');
    }, []); */

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

                {/* <CustomTooltip nameSpace="profile" translation="pages.discovery" placement="right">
                    <DiscoveryIcon
                        onClick={handleDiscoveryPage}
                        width="28px"
                        height="28px"
                        className={clsx(styles.linkIcon, {
                            [styles.activeIcon]: isDiscoveryLinkActive,
                        })}
                    />
                </CustomTooltip> */}

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
});

export { DashBoardNavigation };
