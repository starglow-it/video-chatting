import { memo, useCallback } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomDivider } from 'shared-frontend/library/custom/CustomDivider';
import { CustomTooltip } from 'shared-frontend/library/custom/CustomTooltip';
import { DiscoveryIcon } from 'shared-frontend/icons/OtherIcons/DiscoveryIcon';
import { PeopleIcon } from 'shared-frontend/icons/OtherIcons/PeopleIcon';
import { StatisticsIcon } from 'shared-frontend/icons/OtherIcons/StatisticsIcon';
import { ExitIcon } from 'shared-frontend/icons/OtherIcons/ExitIcon';
import { ImageIcon } from 'shared-frontend/icons/OtherIcons/ImageIcon';

// components
import { Translation } from '@components/Translation/Translation';

// stores
import { logoutAdminFx } from '../../store';

// styles
import styles from './AdminNavigation.module.scss';

const Component = () => {
    const router = useRouter();

    const handleLogout = useCallback(async () => {
        logoutAdminFx();
    }, []);

    const isStatisticsPageActive = router.pathname === '/statistics';
    const isUsersPageActive = router.pathname === '/users';
    const isRoomsPageActive = router.pathname === '/rooms';
    const isBackgroundsPageActive = router.pathname === '/backgrounds';
    const isFeaturedBackgroundPageActive = router.pathname === '/backgrounds';

    const handleStatisticsPage = useCallback(async () => {
        await router.push('/statistics');
    }, []);

    const handleUsersPage = useCallback(async () => {
        await router.push('/users');
    }, []);

    const handleRoomsPage = useCallback(async () => {
        await router.push('/rooms');
    }, []);

    const handleBackgroundsPage = () => {
        router.push('/background');
    };

    const handleFeaturedBackgroundPage = () => {
        router.push('/featured-background');
    };

    return (
        <CustomPaper className={styles.adminNavigation}>
            <CustomGrid
                container
                alignItems="center"
                justifyContent="center"
                direction="column"
                className={styles.iconsWrapper}
                gap={1}
            >
                <CustomTooltip
                    title={
                        <Translation
                            nameSpace="common"
                            translation="tooltips.pages.statistics"
                        />
                    }
                    placement="right"
                >
                    <StatisticsIcon
                        onClick={handleStatisticsPage}
                        width="28px"
                        height="28px"
                        className={clsx(styles.linkIcon, {
                            [styles.activeIcon]: isStatisticsPageActive,
                        })}
                    />
                </CustomTooltip>

                <CustomTooltip
                    title={
                        <Translation
                            nameSpace="common"
                            translation="tooltips.pages.users"
                        />
                    }
                    placement="right"
                >
                    <PeopleIcon
                        onClick={handleUsersPage}
                        width="28px"
                        height="28px"
                        className={clsx(styles.linkIcon, {
                            [styles.activeIcon]: isUsersPageActive,
                        })}
                    />
                </CustomTooltip>

                <CustomTooltip
                    title={
                        <Translation
                            nameSpace="common"
                            translation="tooltips.pages.rooms"
                        />
                    }
                    placement="right"
                >
                    <DiscoveryIcon
                        onClick={handleRoomsPage}
                        width="28px"
                        height="28px"
                        className={clsx(styles.linkIcon, {
                            [styles.activeIcon]: isRoomsPageActive,
                        })}
                    />
                </CustomTooltip>

                <CustomTooltip
                    title={
                        <Translation
                            nameSpace="common"
                            translation="tooltips.pages.backgrounds"
                        />
                    }
                    placement="right"
                >
                    <ImageIcon
                        onClick={handleBackgroundsPage}
                        width="22px"
                        height="22px"
                        className={clsx(styles.linkIcon, {
                            [styles.activeIcon]: isBackgroundsPageActive,
                        })}
                    />
                </CustomTooltip>

                <CustomTooltip
                    title={
                        <Translation
                            nameSpace="common"
                            translation="tooltips.pages.backgrounds"
                        />
                    }
                    placement="right"
                >
                    <ImageIcon
                        onClick={handleFeaturedBackgroundPage}
                        width="22px"
                        height="22px"
                        className={clsx(styles.linkIcon, {
                            [styles.activeIcon]: isFeaturedBackgroundPageActive,
                        })}
                    />
                </CustomTooltip>

                <CustomDivider className={styles.divider} light />

                <CustomTooltip
                    title={
                        <Translation
                            nameSpace="common"
                            translation="tooltips.logout"
                        />
                    }
                    placement="right"
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
};

export const AdminNavigation = memo(Component);
