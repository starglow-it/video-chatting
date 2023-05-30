import React, { useMemo, memo } from 'react';
import { useRouter } from 'next/router';

// custom
import { CustomLink } from '@library/custom/CustomLink/CustomLink';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// styles
import styles from './AuthenticationLink.module.scss';

// const
import { clientRoutes, welcomeRoute } from '../../const/client-routes';
import { initUserWithoutTokenFx } from 'src/store';
import { parseCookies } from 'nookies';
import { getClientMeetingUrl } from 'src/utils/urls';

const Component = () => {
    const router = useRouter();

    const isNotLoginPage = !router.pathname.includes(clientRoutes.loginRoute);

    const customLinkProps = useMemo(
        () => ({
            text: `${isNotLoginPage ? 'signIn' : 'signUp'}.${
                isNotLoginPage ? 'haveAccount' : 'dontHaveAccount'
            }`,
            link: `${isNotLoginPage ? 'signIn' : 'signUp'}.label`,
            href: isNotLoginPage
                ? clientRoutes.loginRoute
                : clientRoutes.getStartedRoute,
        }),
        [isNotLoginPage],
    );

    const linkTo = async () => {
        if (!isNotLoginPage) {
            const { userWithoutLoginId, userTemplateId } = parseCookies();
            if (!userWithoutLoginId) await initUserWithoutTokenFx();
            else router.push(getClientMeetingUrl(userTemplateId));
        }
    };

    return (
        <CustomGrid container alignItems="center" className={styles.wrapper}>
            <CustomTypography
                className={styles.text}
                variant="body2"
                nameSpace="common"
                translation={customLinkProps.text}
            />
            <CustomLink
                nameSpace="common"
                variant="body2"
                translation={customLinkProps.link}
                href={isNotLoginPage ? customLinkProps.href : ''}
                onClick={linkTo}
            />
            {!isNotLoginPage && (
                <>
                    <CustomTypography
                        className={styles.rightText}
                        variant="body2"
                        nameSpace="common"
                        translation="|"
                    />
                    <CustomLink
                        nameSpace="common"
                        variant="body2"
                        translation="register.text"
                        href=""
                    />
                </>
            )}
        </CustomGrid>
    );
};

export const AuthenticationLink = memo(Component);
