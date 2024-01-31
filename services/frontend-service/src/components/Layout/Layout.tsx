import { memo, PropsWithChildren, useState, useEffect, useMemo, useRef, createRef, useCallback } from 'react';
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

import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import { profileRoute } from '../../const/client-routes';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { TemplatesIcon } from 'shared-frontend/icons/OtherIcons/TemplatesIcon';
import { ExitIcon } from 'shared-frontend/icons/OtherIcons/ExitIcon';
import { PersonIcon } from 'shared-frontend/icons/OtherIcons/PersonIcon';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';


import { Footer } from '@components/Footer/Footer';

// types
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { MeetingEndDialog } from '@components/Dialogs/MeetingEndDialog/MeetingEndDialog';
import { parseCookies } from 'nookies';
import { getClientMeetingUrl } from 'src/utils/urls';
import { HeaderRoomLink } from '@components/HeaderRoomLink/HeaderRoomLink';
import { LayoutProps } from './types';

// stores
import {
    $authStore,
    $profileStore,
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
    initUserWithoutTokenFx,
    loadmoreCommonTemplates,
    loadmoreUserTemplates,
    sendJoinDashboardSocketEvent,
    logoutUserFx
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
    const [isDashboardRoomRoute, setIsDashboardRoomRoute] = useState(false);
    

    const router = useRouter();
    const scrollRef = useRef<HTMLElement | null>(null);

    const isDashboardRoute = ROUTES_MAIN_HEADER.some(route =>
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
        const checkRoute = () => {
            const matches = DASHBOARD_ROOM_HEADER.some(route =>
                new RegExp(route).test(router.pathname),
            );
            setIsDashboardRoomRoute(matches);
        };

        // Check the route initially
        checkRoute();

        // Check the route whenever the pathname changes on the client side
        const handleRouteChange = () => {
            checkRoute();
        };

        router.events.on('routeChangeComplete', handleRouteChange);

        (async () => {
            if (isDashboardRoute || isRoomRoute || isBaseRoute) {
                initiateSocketConnectionEvent();
            }
        })();

        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
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

    const hanleStartFreeRoom = async () => {
        const { userWithoutLoginId, userTemplateId } = parseCookies();
        if (!userWithoutLoginId) await initUserWithoutTokenFx({});
        else {
            const newPageUrl = await getClientMeetingUrl(userTemplateId);

            window.open(newPageUrl, '_blank');
        }
    };

    const heightFull = useMemo(() => {
        return { '--vh': `${height * 0.01}px` } as React.CSSProperties;
    }, [height, isMobile, isMeetingRoute]);

    const handleProfilePage = useCallback(async () => {
        handleMenuClose();
        await router.push(profileRoute);
    }, []);

    const isProfilePageActive = router.pathname === profileRoute;
    const profileState = useStore($profileStore);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleAvatarClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleTemplatesPage = useCallback(async () => {
        handleMenuClose();
        await router.push(dashboardRoute);
    }, []);

    const isTemplatesLinkActive = router.pathname === dashboardRoute;

    const handleLogout = useCallback(async () => {
        handleMenuClose();
        logoutUserFx();
        localStorage.removeItem("isFirstDashboardVisit");
        localStorage.removeItem("isFirstMeeting");
    }, []);

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
                            condition={!isNotFoundRoute && !isRoomRoute}
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
                                            xs: 'row',
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
                                                onClick={hanleStartFreeRoom}
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
                                        <ConditionalRender
                                            condition={
                                                isRoomRoute && isAuthenticated
                                            }
                                        >
                                            <HeaderRoomLink />
                                        </ConditionalRender>
                                        {/* User Info */}
                                        <ConditionalRender
                                            condition={
                                                isDashboardRoute && isAuthenticated
                                            }
                                        >
                                            <div>
                                                <IconButton
                                                    id="profileAvatarIcon"
                                                    onClick={handleAvatarClick}
                                                    className={styles.iconButton}
                                                >
                                                    <ProfileAvatar
                                                        src={profileState?.profileAvatar?.url}
                                                        userName={profileState.fullName}
                                                        className={clsx(styles.profileImage, styles.linkIcon, {
                                                            [styles.activeProfile]: isProfilePageActive,
                                                        })}
                                                    />
                                                </IconButton>

                                                <Menu
                                                    anchorEl={anchorEl}
                                                    keepMounted
                                                    open={Boolean(anchorEl)}
                                                    onClose={handleMenuClose}
                                                    className={styles.menu}
                                                >
                                                    <CustomTooltip
                                                        nameSpace="profile"
                                                        placement="right"
                                                        translation="pages.profile"
                                                    >
                                                        <MenuItem>
                                                            <PersonIcon
                                                                onClick={handleProfilePage}
                                                                width="28px"
                                                                height="28px"
                                                                className={clsx(styles.linkIcon, {
                                                                    [styles.activeIcon]: isProfilePageActive,
                                                                })}
                                                            />
                                                        </MenuItem>

                                                    </CustomTooltip>
                                                    <CustomTooltip
                                                        nameSpace="profile"
                                                        translation="pages.templates"
                                                        placement="right"
                                                    >
                                                        <MenuItem>
                                                            <TemplatesIcon
                                                                onClick={handleTemplatesPage}
                                                                width="28px"
                                                                height="28px"
                                                                className={clsx(styles.linkIcon, {
                                                                    [styles.activeIcon]: isTemplatesLinkActive,
                                                                })}
                                                            />
                                                        </MenuItem>

                                                    </CustomTooltip>
                                                    <CustomTooltip
                                                        nameSpace="profile"
                                                        translation="pages.logout"
                                                        placement="right"
                                                    >
                                                        <MenuItem>
                                                            <ExitIcon
                                                                onClick={handleLogout}
                                                                className={styles.icon}
                                                                width="28px"
                                                                height="28px"
                                                            />
                                                        </MenuItem>

                                                    </CustomTooltip>
                                                </Menu>
                                            </div>
                                        </ConditionalRender>
                                    </CustomGrid>
                                </CustomGrid>
                            </CustomBox>
                        </ConditionalRender>
                        {children}
                        <MeetingFinishedDialog />
                        <MeetingEndDialog />
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
        </CustomBox >
    );
};

export const Layout = memo(Component);
