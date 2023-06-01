import React, { memo, PropsWithChildren, useEffect, useMemo } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// library
import { LiveOfficeLogo } from 'shared-frontend/icons/OtherIcons/LiveOfficeLogo';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// custom
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomLink } from '@library/custom/CustomLink/CustomLink';

// components
import { AuthenticationLink } from '@components/AuthenticationLink/AuthenticationLink';
import { MeetingFinishedDialog } from '@components/Dialogs/MeetingFinishedDialog/MeetingFinishedDialog';

import { Footer } from '@components/Footer/Footer';

// types
import { LayoutProps } from './types';

// stores
import {
    $authStore,
    $isSocketConnected,
    getAppVersionFx,
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
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';

const SubscriptionExpiredNotification = dynamic(
    () =>
        import(
            '@components/SubscriptionExpiredNotification/SubscriptionExpiredNotification'
        ),
    {
        ssr: false,
    },
);

const ROUTES_WITHOUT_FOOTER: string[] = [
    roomRoute,
    createRoomRoute,
    editRoomRoute,
];

const Component = ({ children }: PropsWithChildren<LayoutProps>) => {
    const { isAuthenticated } = useStore($authStore);
    const isSocketConnected = useStore($isSocketConnected);

    const router = useRouter();

    const isDashboardRoute = new RegExp(`${dashboardRoute}`).test(
        router.pathname,
    );
    const isRoomRoute = new RegExp(`${roomRoute}`).test(router.pathname);

    const shouldShowFooter = useMemo(
        () =>
            !ROUTES_WITHOUT_FOOTER.find(route =>
                new RegExp(`${route}`).test(router.pathname),
            ),
        [router.pathname],
    );

    useEffect(() => {
        (async () => {
            if (isDashboardRoute || isRoomRoute) {
                initiateSocketConnectionEvent();
            }
        })();
    }, [router.pathname]);

    useEffect(() => {
        if (shouldShowFooter) getAppVersionFx();
    }, []);

    const { isMobile } = useBrowserDetect();

    useEffect(() => {
        if (isSocketConnected) {
            sendJoinDashboardSocketEvent();
        }
    }, [isSocketConnected]);

    const isMeetingRoute =
        router.pathname.includes('room') ||
        router.pathname.includes('dashboard/templates/setup');

    return (
        <CustomBox
            className={clsx(styles.main, {
                [styles.meetingLayout]: isMeetingRoute,
                [styles.relativeLayout]: isMeetingRoute || isDashboardRoute,
            })}
        >
            <ConditionalRender condition={isDashboardRoute}>
                <SubscriptionExpiredNotification />
            </ConditionalRender>

            <CustomBox className={styles.bgImage} />
            <CustomScroll
                onYReachEnd={() => console.log('#Duy Phan console', 'end')}
                options={{
                    // swipeEasing: true,
                    // wheelSpeed: 800,
                    wheelPropagation: true,
                    // suppressScrollY: true,
                }}
            >
                <CustomGrid
                    container
                    direction="column"
                    flex={1}
                    flexWrap="nowrap"
                    className={clsx(styles.contentWrapper, {
                        [styles.meetingLayout]: isMeetingRoute,
                        [styles.relativeLayout]:
                            isMeetingRoute || isDashboardRoute,
                    })}
                >
                    <CustomGrid
                        item
                        flex={1}
                        className={clsx({ [styles.mobileContent]: isMobile })}
                    >
                        <ConditionalRender condition={!isMobile}>
                            <CustomBox className={styles.header}>
                                <CustomGrid
                                    container
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <CustomLink
                                        href={
                                            isAuthenticated
                                                ? dashboardRoute
                                                : ''
                                        }
                                    >
                                        <LiveOfficeLogo
                                            className={clsx(isAuthenticated, {
                                                [styles.link]: isAuthenticated,
                                            })}
                                            width="210px"
                                            height="44px"
                                        />
                                    </CustomLink>
                                    <CustomGrid>
                                        {!isAuthenticated && (
                                            <AuthenticationLink />
                                        )}
                                    </CustomGrid>
                                </CustomGrid>
                            </CustomBox>
                        </ConditionalRender>
                        {children}
                        <MeetingFinishedDialog />
                    </CustomGrid>
                    <ConditionalRender condition={shouldShowFooter}>
                        <CustomGrid item>
                            <Footer />
                        </CustomGrid>
                    </ConditionalRender>
                </CustomGrid>
            </CustomScroll>
        </CustomBox>
    );
};

export const Layout = memo(Component);
