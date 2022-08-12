import React, { memo, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';
import { useRouter } from 'next/router';

// library
import { LiveOfficeLogo } from '@library/icons/LiveOfficeLogo';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomLink } from '@library/custom/CustomLink/CustomLink';
import { TimeLimitNotification } from '@components/TimeLimitNotification/TimeLimitNotification';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// components
import { AuthenticationLink } from '@components/AuthenticationLink/AuthenticationLink';

// types
import { LayoutProps } from './types';

// stores
import {
    $authStore,
    $isSocketConnected,
    initiateSocketConnectionEvent,
    joinDashboard,
} from '../../store';

// styles
import styles from './Layout.module.scss';

const Layout = memo(({ children }: LayoutProps): JSX.Element => {
    const { isAuthenticated } = useStore($authStore);
    const [isMeetingRoute, setIsMeetingRoute] = useState(false);
    const isSocketConnected = useStore($isSocketConnected);

    const router = useRouter();

    useEffect(() => {
        (async () => {
            const isDashboardRoute = /dashboard/.test(router.pathname);

            if (isDashboardRoute) {
                initiateSocketConnectionEvent();
            }
        })();
    }, [router.pathname]);

    useEffect(() => {
        if (isSocketConnected) {
            joinDashboard();
        }
    }, [isSocketConnected]);

    useEffect(() => {
        const isTargetRoute =
            router.pathname.includes('room') ||
            router.pathname.includes('dashboard/templates/setup');

        setIsMeetingRoute(isTargetRoute);
    }, [router]);

    return (
        <CustomBox className={clsx(styles.main, { [styles.meetingLayout]: isMeetingRoute })}>
            <ConditionalRender condition={isMeetingRoute}>
                <TimeLimitNotification />
            </ConditionalRender>
            <CustomBox
                className={clsx(styles.contentWrapper, { [styles.meetingLayout]: isMeetingRoute })}
            >
                <CustomBox className={styles.bgImage} />
                <CustomBox className={styles.header}>
                    <CustomGrid container justifyContent="space-between" alignItems="center">
                        <CustomLink href={isAuthenticated ? '/dashboard' : ''}>
                            <LiveOfficeLogo
                                className={clsx(isAuthenticated, {
                                    [styles.link]: isAuthenticated,
                                })}
                                width="210px"
                                height="44px"
                            />
                        </CustomLink>
                        <CustomGrid>{!isAuthenticated && <AuthenticationLink />}</CustomGrid>
                    </CustomGrid>
                </CustomBox>
                {children}
            </CustomBox>
        </CustomBox>
    );
});

export { Layout };
