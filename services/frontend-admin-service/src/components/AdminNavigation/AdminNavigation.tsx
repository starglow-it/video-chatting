import React, { memo, useCallback } from 'react';
import Router from 'next/router';

// custom
import { CustomTooltip, CustomDivider, CustomGrid, CustomPaper } from 'shared-frontend/library';
import { Translation } from '@components/Translation/Translation';

// icons
import { ExitIcon } from 'shared-frontend/icons';

// stores
import { logoutAdminFx } from '../../store';

// styles
import styles from './AdminNavigation.module.scss';

const Component = () => {
    const handleLogout = useCallback(async () => {
        await logoutAdminFx();

        await Router.push('/');
    }, []);

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
                <CustomDivider className={styles.divider} light />

                <CustomTooltip
                    title={<Translation nameSpace="common" translation="tooltips.logout" />}
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
