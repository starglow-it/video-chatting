import React, { useMemo, memo } from 'react';
import { useRouter } from 'next/router';

import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { initUserWithoutTokenFx } from 'src/store';
import { parseCookies } from 'nookies';
import { getClientMeetingUrl } from 'src/utils/urls';
import {
    clientRoutes,
    loginRoute,
    welcomeRoute,
} from '../../const/client-routes';
import styles from './AuthenticationLink.module.scss';
import clsx from 'clsx';

const Component = () => {
    const router = useRouter();

    const isNotLoginPage = !router.pathname.includes(clientRoutes.loginRoute);

    const customLinkProps = useMemo(
        () => [
            {
                id: 0,
                name: 'FAQ',
                onAction: () => {},
            },
            {
                id: 1,
                name: 'Membership',
                onAction: () => {},
            },
            {
                id: 2,
                name: isNotLoginPage ? 'Login' : 'Welcome',
                onAction: () =>
                    isNotLoginPage
                        ? router.push(loginRoute)
                        : router.push(welcomeRoute),
            },
            {
                id: 4,
                name: 'Start Calling for Free',
                onAction: async () => {
                    const { userWithoutLoginId, userTemplateId } =
                        parseCookies();
                    if (!userWithoutLoginId) await initUserWithoutTokenFx();
                    else router.push(getClientMeetingUrl(userTemplateId));
                },
            },
        ],

        [isNotLoginPage],
    );

    return (
        <CustomGrid container alignItems="center" className={styles.wrapper}>
            {customLinkProps.map(item => (
                <CustomGrid
                    key={item.id}
                    className={clsx(styles.button, {
                        [styles.bgBlack]: item.id === 4,
                    })}
                    onClick={item.onAction}
                >
                    {item.name}
                </CustomGrid>
            ))}
        </CustomGrid>
    );
};

export const AuthenticationLink = memo(Component);
