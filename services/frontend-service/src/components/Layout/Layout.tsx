import React, { memo, PropsWithChildren, useEffect, useMemo } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

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

// const
import {
    createRoomRoute,
    dashboardRoute,
    editRoomRoute,
    roomRoute,
} from '../../const/client-routes';

// styles
import styles from './Layout.module.scss';

const TimeLimitNotification = dynamic(
    () => import('@components/TimeLimitNotification/TimeLimitNotification'),
    {
        ssr: false,
    },
);

const TimeLimitWarning = dynamic(() => import('@components/TimeLimitWarning/TimeLimitWarning'), {
    ssr: false,
});

const SubscriptionExpiredNotification = dynamic(
    () => import('@components/SubscriptionExpiredNotification/SubscriptionExpiredNotification'),
    {
        ssr: false,
    },
);

const ROUTES_WITHOUT_FOOTER: string[] = [roomRoute, createRoomRoute, editRoomRoute];

const Component = ({ children }: PropsWithChildren<LayoutProps>) => {
    const { isAuthenticated } = useStore($authStore);
    const isSocketConnected = useStore($isSocketConnected);

    const router = useRouter();

    const isDashboardRoute = new RegExp(`${dashboardRoute}`).test(router.pathname);
    const isRoomRoute = new RegExp(`${roomRoute}`).test(router.pathname);

    const shouldShowFooter = useMemo(
        () => !ROUTES_WITHOUT_FOOTER.find(route => new RegExp(`${route}`).test(router.pathname)),
        [router.pathname],
    );

    useEffect(() => {
        (async () => {
            if (isDashboardRoute || isRoomRoute) {
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

            <ConditionalRender condition={isDashboardRoute}>
                <SubscriptionExpiredNotification />
            </ConditionalRender>

            <CustomGrid
                container
                direction="column"
                flex={1}
                flexWrap="nowrap"
                className={clsx(styles.contentWrapper, {
                    [styles.meetingLayout]: isMeetingRoute,
                    [styles.relativeLayout]: isMeetingRoute || isDashboardRoute,
                })}
            >
                <CustomGrid item flex={1}>
                    <CustomBox className={styles.bgImage} />
                    <ConditionalRender condition={!isMobile}>
                        <CustomBox className={styles.header}>
                            <CustomGrid
                                container
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <CustomLink href={isAuthenticated ? dashboardRoute : ''}>
                                    <LiveOfficeLogo
                                        className={clsx(isAuthenticated, {
                                            [styles.link]: isAuthenticated,
                                        })}
                                        width="210px"
                                        height="44px"
                                    />
                                </CustomLink>
                                <CustomGrid>
                                    {!isAuthenticated && <AuthenticationLink />}
                                </CustomGrid>
                            </CustomGrid>
                        </CustomBox>
                    </ConditionalRender>
                    {children}
                </CustomGrid>
                <ConditionalRender condition={shouldShowFooter}>
                    <CustomGrid item>
                        <Footer />
                    </CustomGrid>
                </ConditionalRender>
            </CustomGrid>
        </CustomBox>
    );
};

export const Layout = memo(Component);
