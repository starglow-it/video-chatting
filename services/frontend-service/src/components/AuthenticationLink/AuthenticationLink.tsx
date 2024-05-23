import { useMemo, memo } from 'react';
import { useRouter } from 'next/router';

import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { initUserWithoutTokenFx } from 'src/store';
import { parseCookies } from 'nookies';
import { getClientMeetingUrl } from 'src/utils/urls';
import clsx from 'clsx';
import {
    clientRoutes,
    loginRoute,
    welcomeRoute,
} from '../../const/client-routes';
import styles from './AuthenticationLink.module.scss';

const Component = () => {
    const router = useRouter();

    const isNotLoginPage = !router.pathname.includes(clientRoutes.loginRoute);

    const customLinkProps = useMemo(
        () => [
            {
                id: 0,
                name: 'FAQ',
                onAction: () =>
                    (window.location.href = 'https://chatruume.com/faq'),
            },
            {
                id: 1,
                name: 'Membership',
                onAction: () =>
                    (window.location.href = 'https://chatruume.com/membership'),
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
                    try {
                        const { userWithoutLoginId, userTemplateId } =
                            parseCookies();
                        if (!userWithoutLoginId) await initUserWithoutTokenFx({});
                        else {
                            const newPageUrl = await getClientMeetingUrl(userTemplateId);
                            router.push(newPageUrl)
                        }
                    } catch (error) {
                        console.log(error);
                    }
                },
            },
        ],

        [isNotLoginPage],
    );

    return (
        <CustomGrid
            container
            alignItems="center"
            className={styles.wrapper}
            sx={{
                marginRight: { xs: '0px', sm: '34px', xl: '34px', md: '34px' },
            }}
        >
            {customLinkProps.map(item => (
                <CustomGrid
                    key={item.id}
                    className={clsx(styles.button, {
                        [styles.bgBlack]: item.id === 4,
                    })}
                    onClick={item.onAction}
                    sx={{
                        display: {
                            xs: item.id === 4 ? 'none' : 'flex',
                            md: 'flex',
                            sm: 'flex',
                        },
                    }}
                >
                    {item.name}
                </CustomGrid>
            ))}
        </CustomGrid>
    );
};

export const AuthenticationLink = memo(Component);
