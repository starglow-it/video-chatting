import React, { memo, useCallback, useMemo } from 'react';
import { useStore } from 'effector-react';
import Router, { useRouter } from 'next/router';
import clsx from 'clsx';

import { Divider } from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

import { TemplatesIcon } from '@library/icons/TemplatesIcon';
import { $profileStore } from '../../store/profile';
import { logoutUserFx } from '../../store/auth';

import styles from './DashBoardNavigation.module.scss';
import {CustomTooltip} from "@library/custom/CustomTooltip/CustomTooltip";
import {ExitIcon} from "@library/icons/ExitIcon";

const DashBoardNavigation = memo(() => {
    const profileState = useStore($profileStore);
    const router = useRouter();

    const handleLogout = useCallback(async () => {
        await logoutUserFx();

        await Router.push('/login');
    }, []);

    const isTemplatesLinkActive = useMemo(
        () => router.pathname === '/dashboard/templates',
        [router.pathname],
    );

    const isProfilePageActive = useMemo(() => router.pathname === '/dashboard', [router.pathname]);

    const handleProfilePage = useCallback(() => {
        router.push('/dashboard');
    }, []);

    const handleTemplatesPage = useCallback(() => {
        router.push('/dashboard/templates');
    }, []);

    return (
        <CustomPaper className={styles.dashboardNavigation}>
            <CustomGrid
                container
                alignItems="center"
                justifyContent="center"
                direction="column"
                className={styles.iconsWrapper}
            >
                <CustomTooltip
                    nameSpace="common"
                    translation="pages.profile"
                    placement="right"
                >
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

                <Divider className={styles.divider} light />

                <CustomTooltip
                    nameSpace="common"
                    translation="pages.templates"
                    placement="right"
                >
                    <TemplatesIcon
                        onClick={handleTemplatesPage}
                        width="28px"
                        height="28px"
                        className={clsx(styles.linkIcon, {
                            [styles.activeIcon]: isTemplatesLinkActive,
                        })}
                    />
                </CustomTooltip>

                <CustomTooltip
                    nameSpace="common"
                    placement="right"
                    translation="pages.logout"
                >
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
