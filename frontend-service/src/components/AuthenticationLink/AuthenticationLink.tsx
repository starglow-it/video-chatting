import React, { useMemo, memo } from 'react';
import { useRouter } from 'next/router';

import { CustomLink } from '@library/custom/CustomLink/CustomLink';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

import styles from './AuthenticationLink.module.scss';

const AuthenticationLink = memo(() => {
    const router = useRouter();
    const isNotLoginPage = !router.pathname.includes('login');

    const customLinkProps = useMemo(
        () => ({
            text: `${isNotLoginPage ? 'signIn' : 'signUp'}.${
                isNotLoginPage ? 'haveAccount' : 'dontHaveAccount'
            }`,
            link: `${isNotLoginPage ? 'signIn' : 'signUp'}.label`,
            href: isNotLoginPage ? '/login' : '/welcome',
        }),
        [isNotLoginPage],
    );

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
                translation={customLinkProps.link}
                href={customLinkProps.href}
            />
        </CustomGrid>
    );
});

export { AuthenticationLink };
