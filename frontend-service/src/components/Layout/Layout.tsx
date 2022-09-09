import React, { memo, PropsWithChildren, useEffect } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';
import { useRouter } from 'next/router';

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// library
import { LiveOfficeLogo } from '@library/icons/LiveOfficeLogo';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// custom
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomLink } from '@library/custom/CustomLink/CustomLink';

// components
import { AuthenticationLink } from '@components/AuthenticationLink/AuthenticationLink';
import { TimeLimitNotification } from '@components/TimeLimitNotification/TimeLimitNotification';
import { TimeLimitWarning } from '@components/TimeLimitWarning/TimeLimitWarning';
import { Footer } from '@components/Footer/Footer';

// types
import { LayoutProps } from './types';

// stores
import {
    $authStore,
    $isSocketConnected,
    initiateSocketConnectionEvent,
    sendJoinDashboardSocketEvent,
} from '../../store';

// styles
import styles from './Layout.module.scss';
import { dashboardRoute } from '../../const/client-routes';

const Component = ({ children }: PropsWithChildren<LayoutProps>) => {
    const { isAuthenticated } = useStore($authStore);
    const isSocketConnected = useStore($isSocketConnected);

    const router = useRouter();

    const isDashboardRoute = new RegExp(`${dashboardRoute}`).test(router.pathname);

    useEffect(() => {
        (async () => {
            if (isDashboardRoute) {
                initiateSocketConnectionEvent();
            }
        })();
    }, [router.pathname]);

    const { isMobile } = useBrowserDetect();

    useEffect(() => {
        if (isSocketConnected) {
            sendJoinDashboardSocketEvent();
        }
    }, [isSocketConnected]);

    const isMeetingRoute =
        router.pathname.includes('room') || router.pathname.includes('dashboard/templates/setup');

    return (
        <CustomBox
            className={clsx(styles.main, {
                [styles.meetingLayout]: isMeetingRoute,
                [styles.relativeLayout]: isMeetingRoute || isDashboardRoute,
            })}
        >
            <ConditionalRender condition={isMeetingRoute || isDashboardRoute}>
                <TimeLimitNotification />
            </ConditionalRender>

            <ConditionalRender condition={isMeetingRoute}>
                <TimeLimitWarning />
            </ConditionalRender>

            <CustomBox
                className={clsx(styles.contentWrapper, {
                    [styles.meetingLayout]: isMeetingRoute,
                    [styles.relativeLayout]: isMeetingRoute || isDashboardRoute,
                })}
            >
                <CustomBox className={styles.bgImage} />
                <ConditionalRender condition={!isMobile}>
                    <CustomBox className={styles.header}>
                        <CustomGrid container justifyContent="space-between" alignItems="center">
                            <CustomLink href={isAuthenticated ? dashboardRoute : ''}>
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
                </ConditionalRender>
                {children}
                <Footer />
            </CustomBox>
        </CustomBox>
    );
};

export const Layout = memo(Component);
