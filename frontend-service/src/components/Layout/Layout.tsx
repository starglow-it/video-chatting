import React, { memo } from 'react';
import { Theme } from '@mui/material';
import { useStore } from 'effector-react';

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

const Layout = memo(({ children }: LayoutProps): JSX.Element => {
    const { isAuthenticated } = useStore($authStore);

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
                            <LiveOfficeLogo width="210px" height="44px" />
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
