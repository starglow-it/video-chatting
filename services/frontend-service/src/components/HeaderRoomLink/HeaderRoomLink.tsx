import { useMemo, memo } from 'react';
import { useRouter } from 'next/router';

import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import clsx from 'clsx';
import { dashboardRoute } from '../../const/client-routes';
import styles from './HeaderRoomLink.module.scss';

const Component = () => {
    const router = useRouter();

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
                name: 'Dashboard',
                onAction: () => router.push(dashboardRoute),
            },
        ],

        [],
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
                    className={clsx(styles.button)}
                    onClick={item.onAction}
                // sx={{
                //     display: {
                //         xs: 'none',
                //         md: 'flex',
                //         sm: 'flex',
                //     },
                // }}
                >
                    {item.name}
                </CustomGrid>
            ))}
        </CustomGrid>
    );
};

export const HeaderRoomLink = memo(Component);
