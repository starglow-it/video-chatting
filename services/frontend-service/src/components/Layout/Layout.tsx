import React, {
    memo,
    PropsWithChildren,
    useEffect,
    useMemo,
    useRef,
} from 'react';
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
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { LayoutProps } from './types';

// stores
import {
    $authStore,
    $isSocketConnected,
    $modeTemplateStore,
    $profileTemplatesStore,
    $templatesStore,
    getAppVersionFx,
    getProfileTemplatesFx,
    getTemplatesFx,
    initiateSocketConnectionEvent,
    loadmoreCommonTemplates,
    loadmoreMetaTemplates,
    loadmoreUserTemplates,
    sendJoinDashboardSocketEvent,
} from '../../store';

// const
import {
    createRoomRoute,
    dashboardRoute,
    editRoomRoute,
    roomRoute,
    welcomeRoute,
} from '../../const/client-routes';

// styles
import styles from './Layout.module.scss';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

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

const ROUTES_MAIN_HEADER: string[] = [dashboardRoute, welcomeRoute];

const Component = ({ children }: PropsWithChildren<LayoutProps>) => {
    const { isAuthenticated } = useStore($authStore);
    const isSocketConnected = useStore($isSocketConnected);
    const isLoadingCommonTemplates = useStore(getTemplatesFx.pending);
    const isLoadingTemplates = useStore(getProfileTemplatesFx.pending);
    const templates = useStore($templatesStore);
    const profileTemplates = useStore($profileTemplatesStore);
    const mode = useStore($modeTemplateStore);

    const router = useRouter();
    const scrollRef = useRef<HTMLElement | null>(null);

    const isDashboardRoute = ROUTES_MAIN_HEADER.some(route =>
        new RegExp(route).test(router.pathname),
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

    const handleScrollToEnd = () => {
        if (router.pathname === dashboardRoute) {
            switch (mode) {
                case 'private':
                    if (
                        !isLoadingTemplates &&
                        profileTemplates.list.length &&
                        profileTemplates.list.length < profileTemplates.count
                    ) {
                        loadmoreUserTemplates();
                    }
                    break;
                case 'common':
                    if (
                        !isLoadingCommonTemplates &&
                        templates.list.length &&
                        templates.list.length < templates.count
                    ) {
                        loadmoreCommonTemplates();
                    }
                    break;
                default:
                    break;
            }
        }
    };

    const handleScrollUp = () => {
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
    };

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
                onYReachEnd={handleScrollToEnd}
                options={{
                    wheelPropagation: true,
                }}
                containerRef={el => (scrollRef.current = el)}
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
                        className={clsx({
                            [styles.mobileContent]:
                                isMobile && !isDashboardRoute,
                        })}
                    >
                        <ConditionalRender condition={!isMobile}>
                            <CustomBox
                                className={clsx(styles.header, {
                                    [styles.dashboard]: isDashboardRoute,
                                })}
                            >
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
                                        <CustomImage
                                            src="/images/Ruume.svg"
                                            width="210px"
                                            height="44px"
                                            className={clsx(isAuthenticated, {
                                                [styles.link]: isAuthenticated,
                                            })}
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
                            <Footer onScrollUp={handleScrollUp} />
                        </CustomGrid>
                    </ConditionalRender>
                </CustomGrid>
            </CustomScroll>
        </CustomBox>
    );
};

export const Layout = memo(Component);
