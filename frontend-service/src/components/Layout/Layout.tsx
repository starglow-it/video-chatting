import React, { memo, useEffect } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';
import { useRouter } from 'next/router';

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

const Component: React.FunctionComponent<LayoutProps> = ({ children }) => {
    const { isAuthenticated } = useStore($authStore);
    const isSocketConnected = useStore($isSocketConnected);

    const router = useRouter();

    const isDashboardRoute = /dashboard/.test(router.pathname);

    useEffect(() => {
        (async () => {
            if (isDashboardRoute) {
                initiateSocketConnectionEvent();
            }
        })();
    }, [router.pathname]);

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
};

export const Layout = memo(Component);
