import React, {memo, useEffect} from 'react';
import { Theme } from '@mui/material';
import { useStore } from 'effector-react';
import { useRouter } from "next/router";

// library
import { LiveOfficeLogo } from '@library/icons/LiveOfficeLogo';
import { BackgroundLogoLeft } from '@library/icons/BackgroundLogoLeft';
import { BackgroundLogoRight } from '@library/icons/BackgroundLogoRight';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// components
import { AuthenticationLink } from '@components/AuthenticationLink/AuthenticationLink';

// types
import { LayoutProps } from './types';

// stores
import { $authStore } from '../../store/auth';

import styles from './Layout.module.scss';
import {CustomLink} from "@library/custom/CustomLink/CustomLink";

// stores
import {initiateMainSocketConnectionFx} from "../../store/mainServerSocket";
import { emitJoinDashboard } from "../../store/waitingRoom";

const Layout = memo(({ children }: LayoutProps): JSX.Element => {
    const { isAuthenticated } = useStore($authStore);

    const router = useRouter();

    useEffect(() => {
        (async () => {
            const isDashboardRoute = new RegExp('dashboard').test(router.pathname);

            if (isDashboardRoute) {
                await initiateMainSocketConnectionFx();

                emitJoinDashboard();
            }
        })();
    }, []);

    return (
        <>
            <CustomBox
                className={styles.main}
                sx={{
                    backgroundColor: (theme: Theme) => theme.background.default,
                }}
            >
                <CustomBox className={styles.topLeft}>
                    <BackgroundLogoLeft className={styles.icon} width="544px" height="auto" />
                </CustomBox>

                <CustomBox className={styles.topRight}>
                    <BackgroundLogoRight className={styles.icon} width="718px" height="auto" />
                </CustomBox>
                <CustomBox className={styles.contentWrapper}>
                    <CustomBox className={styles.header}>
                        <CustomGrid container justifyContent="space-between" alignItems="center">
                            <CustomLink href={isAuthenticated ? "/dashboard" : ""}>
                                <LiveOfficeLogo width="210px" height="44px" />
                            </CustomLink>
                            <CustomGrid>{!isAuthenticated && <AuthenticationLink />}</CustomGrid>
                        </CustomGrid>
                    </CustomBox>
                    {children}
                </CustomBox>
            </CustomBox>
        </>
    );
});

export { Layout };
