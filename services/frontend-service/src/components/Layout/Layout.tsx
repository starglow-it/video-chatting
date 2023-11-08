import { memo, PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// library
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
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { LayoutProps } from './types';

// stores
import {
    $authStore,
    // $isPortraitLayout,
    $isSocketConnected,
    $modeTemplateStore,
    $profileTemplatesStore,
    $templatesStore,
    $windowSizeStore,
    getAppVersionFx,
    getProfileTemplatesFx,
    getTemplatesFx,
    initiateSocketConnectionEvent,
    loadmoreCommonTemplates,
    loadmoreUserTemplates,
    sendJoinDashboardSocketEvent,
} from '../../store';

// const
import {
    agreementsRoute,
    createRoomRoute,
    dashboardRoute,
    editRoomRoute,
    indexRoute,
    NotFoundRoute,
    registerEndCallRoute,
    registerRoute,
    roomRoute,
    welcomeRoute,
} from '../../const/client-routes';

// styles
import styles from './Layout.module.scss';

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
    NotFoundRoute,
];

const ROUTES_MAIN_HEADER: string[] = [dashboardRoute, welcomeRoute];
const DASHBOARD_ROOM_HEADER: string[] = [createRoomRoute, editRoomRoute];

const ScrollParent = ({
    children,
    isAgreements,
    handleScrollToEnd,
    containerRef,
}: {
    children: any;
    isAgreements: boolean;
    handleScrollToEnd(): void;
    containerRef: any;
}) => {
    if (isAgreements)
        return (
            <CustomBox
                ref={containerRef}
                style={{ overflow: 'scroll', flex: 1 }}
            >
                {children}
            </CustomBox>
        );
    return (
        <CustomScroll
            onYReachEnd={handleScrollToEnd}
            style={{ flex: 1 }}
            options={{
                wheelPropagation: true,
            }}
            containerRef={containerRef}
        >
            {children}
        </CustomScroll>
    );
};

const Component = ({ children }: PropsWithChildren<LayoutProps>) => {
    const { isAuthenticated } = useStore($authStore);
    const isSocketConnected = useStore($isSocketConnected);
    const isLoadingCommonTemplates = useStore(getTemplatesFx.pending);
    const isLoadingTemplates = useStore(getProfileTemplatesFx.pending);
    const templates = useStore($templatesStore);
    const profileTemplates = useStore($profileTemplatesStore);
    const mode = useStore($modeTemplateStore);
    const { height } = useStore($windowSizeStore);
    // const isPortraitLayout = useStore($isPortraitLayout);

    const router = useRouter();
    const scrollRef = useRef<HTMLElement | null>(null);

    const isDashboardRoute = ROUTES_MAIN_HEADER.some(route =>
        new RegExp(route).test(router.pathname),
    );
    const isDashboardRoomRoute = DASHBOARD_ROOM_HEADER.some(route =>
        new RegExp(route).test(router.pathname),
    );
    const isRoomRoute = new RegExp(`${roomRoute}`).test(router.pathname);
    const isBaseRoute = new RegExp(`${indexRoute}`).test(router.pathname);
    const isNotFoundRoute = new RegExp(`${NotFoundRoute}`).test(
        router.pathname,
    );
    const isRegisterRoute = new RegExp(`${registerRoute}`).test(
        router.pathname,
    );
    const isRegisterEndCallRoute = new RegExp(`${registerEndCallRoute}`).test(
        router.pathname,
    );

    const shouldShowFooter = useMemo(
        () =>
            !ROUTES_WITHOUT_FOOTER.find(route =>
                new RegExp(`${route}`).test(router.pathname),
            ) && router.pathname !== '/[token]',
        [router.pathname],
    );

    useEffect(() => {
        (async () => {
            if (isDashboardRoute || isRoomRoute || isBaseRoute) {
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
        if (router.pathname === welcomeRoute) {
            if (
                !isLoadingCommonTemplates &&
                templates.list.length &&
                templates.list.length < templates.count
            ) {
                loadmoreCommonTemplates();
            }
        }
    };

    const handleScrollUp = () => {
        if (router.pathname === agreementsRoute) {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
            });
        } else {
            if (scrollRef.current) scrollRef.current.scrollTop = 0;
        }
    };
    // console.log('#Duy Phan console pt', isPortraitLayout, height)
    const heightFull = useMemo(() => {
        return { '--vh': `${height * 0.01}px` } as React.CSSProperties;
    }, [height, isMobile, isMeetingRoute]);

    return (
        <CustomBox
            className={clsx(styles.main, {
                [styles.meetingLayout]: isMeetingRoute && !isMobile,
                [styles.meetingMobileLayout]: isMeetingRoute && isMobile,
                [styles.relativeLayout]: isMeetingRoute || isDashboardRoute,
            })}
            style={heightFull}
        >
            <ConditionalRender condition={isDashboardRoute}>
                <SubscriptionExpiredNotification />
            </ConditionalRender>

            <CustomBox className={styles.bgImage} />
            <ScrollParent
                isAgreements={
                    router.pathname === agreementsRoute ||
                    (isMobile && isRegisterEndCallRoute)
                }
                handleScrollToEnd={handleScrollToEnd}
                containerRef={(el: any) => (scrollRef.current = el)}
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
                        <ConditionalRender
                            condition={
                                !isMobile
                                    ? !isNotFoundRoute
                                    : (!isNotFoundRoute && !isRoomRoute)
                            }
                        >
                            <CustomBox
                                className={clsx(styles.header, {
                                    [styles.dashboard]: isDashboardRoute,
                                    [styles.background]: isRegisterRoute,
                                    [styles.dashboardRoom]:
                                        isDashboardRoomRoute,
                                })}
                            >
                                <CustomGrid
                                    container
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{
                                        flexDirection: {
                                            sm: 'row',
                                            md: 'row',
                                            xs: 'column',
                                            xl: 'row',
                                        },
                                    }}
                                >
                                    <CustomGrid
                                        container
                                        alignItems="center"
                                        flex={1}
                                    >
                                        <CustomGrid flex={1}>
                                            <CustomLink
                                                href={
                                                    isAuthenticated
                                                        ? dashboardRoute
                                                        : ''
                                                }
                                            >
                                                <CustomImage
                                                    src="/images/Ruume.svg"
                                                    width={
                                                        isMobile
                                                            ? '120px'
                                                            : '210px'
                                                    }
                                                    height="44px"
                                                    className={clsx(
                                                        isAuthenticated,
                                                        {
                                                            [styles.link]:
                                                                isAuthenticated,
                                                        },
                                                    )}
                                                />
                                            </CustomLink>
                                        </CustomGrid>
                                        <ConditionalRender
                                            condition={!isAuthenticated}
                                        >
                                            <CustomGrid
                                                className={clsx(
                                                    styles.button,
                                                    styles.bgBlack,
                                                )}
                                                sx={{
                                                    display: {
                                                        sm: 'none',
                                                        xs: 'flex',
                                                        md: 'none',
                                                        xl: 'none',
                                                    },
                                                }}
                                            >
                                                Start Calling for Free
                                            </CustomGrid>
                                        </ConditionalRender>
                                    </CustomGrid>
                                    <CustomGrid
                                        sx={{
                                            marginTop: {
                                                xs: '10px',
                                                md: '0px',
                                                sm: '0px',
                                                xl: '0px',
                                            },
                                        }}
                                    >
                                        <ConditionalRender
                                            condition={!isAuthenticated}
                                        >
                                            <AuthenticationLink />
                                        </ConditionalRender>
                                    </CustomGrid>
                                </CustomGrid>
                            </CustomBox>
                        </ConditionalRender>
                        {children}
                        <MeetingFinishedDialog />
                    </CustomGrid>
                    <ConditionalRender
                        condition={shouldShowFooter || isNotFoundRoute}
                    >
                        <CustomGrid item>
                            <Footer onScrollUp={handleScrollUp} />
                        </CustomGrid>
                    </ConditionalRender>
                </CustomGrid>
            </ScrollParent>
        </CustomBox>
    );
};

export const Layout = memo(Component);
