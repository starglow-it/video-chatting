import React, { memo, PropsWithChildren } from 'react';
import { useStore } from 'effector-react';

// hooks
import { useBrowserDetect } from 'shared-frontend/hooks';

// custom
import { CustomBox, CustomGrid, ConditionalRender } from 'shared-frontend/library';
import { LiveOfficeLogo } from 'shared-frontend/icons';
import { AdminNavigation } from '@components/AdminNavigation/AdminNavigation';

// types
import { AdminLayoutProps } from './AdminLayout.types';

// styles
import styles from './AdminLayout.module.scss';

import { $authStore } from '../../store';

const Component = ({ children }: PropsWithChildren<AdminLayoutProps>) => {
    const { state: authState } = useStore($authStore);
    const { isMobile } = useBrowserDetect();

    return (
        <CustomBox className={styles.main}>
            <CustomGrid
                container
                direction="column"
                flex={1}
                flexWrap="nowrap"
                className={styles.contentWrapper}
            >
                <CustomGrid item container flex={1}>
                    <CustomBox className={styles.bgImage} />
                    <ConditionalRender condition={!isMobile}>
                        <CustomBox className={styles.header}>
                            <CustomGrid
                                container
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                {/* <CustomLink href="/"> */}
                                {/*    <LiveOfficeLogo */}
                                {/*        width="210px" */}
                                {/*        height="44px" */}
                                {/*    /> */}
                                {/* </CustomLink> */}
                            </CustomGrid>
                        </CustomBox>
                    </ConditionalRender>
                    <ConditionalRender condition={authState.isAuthenticated}>
                        <AdminNavigation />
                    </ConditionalRender>
                    {children}
                </CustomGrid>
            </CustomGrid>
        </CustomBox>
    );
};

export const AdminLayout = memo(Component);
