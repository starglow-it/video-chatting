import { memo, PropsWithChildren, useState, useEffect, useMemo, useRef, createRef, useCallback } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Link from 'next/link';

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
import { StatisticsIcon } from 'shared-frontend/icons/OtherIcons/StatisticsIcon';
import { ExitIcon } from 'shared-frontend/icons/OtherIcons/ExitIcon';
import { PersonIcon } from 'shared-frontend/icons/OtherIcons/PersonIcon';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';

//@mui
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';


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
    recordingRoute,
    welcomeRoute,
    analyticsRoute,
    supportRoute
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

const ROUTES_MAIN_HEADER: string[] = [dashboardRoute, welcomeRoute, analyticsRoute, profileRoute, recordingRoute];
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
    const isRecordingRoute = new RegExp(`${recordingRoute}`).test(router.pathname);
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

            router.push(newPageUrl)
        }
    };

    const heightFull = useMemo(() => {
        return { '--vh': `${height * 0.01}px` } as React.CSSProperties;
    }, [height, isMobile, isMeetingRoute]);

    const isProfilePageActive = router.pathname === profileRoute;
    const profileState = useStore($profileStore);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleAvatarClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (isRecordingRoute) {
            await router.push(profileRoute);
        } else {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfilePage = useCallback(async () => {
        handleMenuClose();
        await router.push(profileRoute);
    }, []);

    const handleTemplatesPage = useCallback(async () => {
        handleMenuClose();
        await router.push(dashboardRoute);
    }, []);

    const handleAnalyticsPage = useCallback(async () => {
        handleMenuClose();
        await router.push(analyticsRoute);
    }, []);

    const handleSupportPage = useCallback(async () => {
        handleMenuClose();
        await router.push(supportRoute);
    }, []);

    const isTemplatesLinkActive = router.pathname === dashboardRoute;
    const isAnalyticsLinkActive = router.pathname === analyticsRoute;

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
                                            <Link
                                                href={
                                                    isAuthenticated
                                                        ? dashboardRoute
                                                        : ''
                                                }
                                            >
                                                <a>
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
                                                </a>
                                            </Link>
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
                                                    <MenuItem
                                                        className={styles.profileItem}
                                                    >
                                                        <ListItemIcon>
                                                            <ProfileAvatar
                                                                src={profileState?.profileAvatar?.url}
                                                                userName={profileState.fullName}
                                                                className={clsx(styles.innerProfileImage, styles.linkIcon)}
                                                                withoutShadow={true}
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText>
                                                            <Typography variant="subtitle1" className={styles.profileName}>{profileState.fullName}</Typography>
                                                            <Typography variant="caption" display="block" className={styles.profileEmail}>{profileState.email}</Typography>
                                                        </ListItemText>
                                                    </MenuItem>
                                                    <Divider />
                                                    <CustomTooltip
                                                        nameSpace="profile"
                                                        placement="right"
                                                        translation="pages.profile"
                                                    >
                                                        <MenuItem
                                                            className={styles.menuItem}
                                                            onClick={handleProfilePage}
                                                        >
                                                            <ListItemIcon>
                                                                <PersonIcon
                                                                    width="28px"
                                                                    height="28px"
                                                                    className={clsx(styles.linkIcon, {
                                                                        [styles.activeIcon]: isProfilePageActive,
                                                                    })}
                                                                />
                                                            </ListItemIcon>
                                                            <ListItemText className={styles.menuText}>
                                                                <Typography variant="caption" display="block" >profile</Typography>
                                                            </ListItemText>
                                                        </MenuItem>
                                                    </CustomTooltip>
                                                    <CustomTooltip
                                                        nameSpace="profile"
                                                        translation="pages.templates"
                                                        placement="right"
                                                    >
                                                        <MenuItem
                                                            className={styles.menuItem}
                                                            onClick={handleTemplatesPage}
                                                        >
                                                            <ListItemIcon>
                                                                <TemplatesIcon
                                                                    width="28px"
                                                                    height="28px"
                                                                    className={clsx(styles.linkIcon, {
                                                                        [styles.activeIcon]: isTemplatesLinkActive,
                                                                    })}
                                                                />
                                                            </ListItemIcon>
                                                            <ListItemText className={styles.menuText}>
                                                                <Typography variant="caption" display="block" >ruumes</Typography>
                                                            </ListItemText>
                                                        </MenuItem>

                                                    </CustomTooltip>
                                                    <CustomTooltip
                                                        nameSpace="profile"
                                                        translation="pages.analytics"
                                                        placement="right"
                                                    >
                                                        <MenuItem
                                                            className={styles.menuItem}
                                                            onClick={handleAnalyticsPage}
                                                        >
                                                            <ListItemIcon>
                                                                <StatisticsIcon
                                                                    width="28px"
                                                                    height="28px"
                                                                    className={clsx(styles.linkIcon, {
                                                                        [styles.activeIcon]: isAnalyticsLinkActive,
                                                                    })}
                                                                />
                                                            </ListItemIcon>
                                                            <ListItemText className={styles.menuText}>
                                                                <Typography variant="caption" display="block" >statistics</Typography>
                                                            </ListItemText>
                                                        </MenuItem>
                                                    </CustomTooltip>
                                                    <CustomTooltip
                                                        nameSpace="profile"
                                                        translation="pages.logout"
                                                        placement="right"
                                                    >
                                                        <MenuItem
                                                            className={styles.menuItem}
                                                            onClick={handleLogout}
                                                        >

                                                            <ListItemIcon>
                                                                <ExitIcon
                                                                    className={styles.linkIcon}
                                                                    width="28px"
                                                                    height="28px"
                                                                />
                                                            </ListItemIcon>
                                                            <ListItemText className={styles.menuText}>
                                                                <Typography variant="caption" display="block" >log out</Typography>
                                                            </ListItemText>
                                                        </MenuItem>
                                                    </CustomTooltip>
                                                    <Divider />
                                                    <CustomTooltip
                                                        nameSpace="profile"
                                                        translation="pages.helpSupport"
                                                        placement="right"
                                                    >
                                                        <MenuItem
                                                            className={styles.menuItem}
                                                            onClick={handleSupportPage}
                                                        >
                                                            <ListItemIcon>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256" id="circle-wavy-question"><rect width="256" height="256" fill="none"></rect><path fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" d="M54.46089,201.53911c-9.204-9.204-3.09935-28.52745-7.78412-39.85C41.82037,149.95168,24,140.50492,24,127.99963,24,115.4945,41.82047,106.048,46.67683,94.31079c4.68477-11.32253-1.41993-30.6459,7.78406-39.8499s28.52746-3.09935,39.85-7.78412C106.04832,41.82037,115.49508,24,128.00037,24c12.50513,0,21.95163,17.82047,33.68884,22.67683,11.32253,4.68477,30.6459-1.41993,39.8499,7.78406s3.09935,28.52746,7.78412,39.85C214.17963,106.04832,232,115.49508,232,128.00037c0,12.50513-17.82047,21.95163-22.67683,33.68884-4.68477,11.32253,1.41993,30.6459-7.78406,39.8499s-28.52745,3.09935-39.85,7.78412C149.95168,214.17963,140.50492,232,127.99963,232c-12.50513,0-21.95163-17.82047-33.68884-22.67683C82.98826,204.6384,63.66489,210.7431,54.46089,201.53911Z"></path><circle cx="127.999" cy="180" r="10"></circle><path fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" d="M127.9995,144.0045v-8a28,28,0,1,0-28-28"></path></svg>
                                                            </ListItemIcon>
                                                            <ListItemText className={styles.menuText}>
                                                                <Typography variant="caption" display="block" >help & support</Typography>
                                                            </ListItemText>
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
