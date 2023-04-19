import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './Spinner.module.scss';

export const SpinnerLoading = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const stop = () => {
        setIsLoading(false);
    };

    const start = () => {
        setIsLoading(true);
    };

    useEffect(() => {
        router.events.on('routeChangeStart', start);
        router.events.on('routeChangeComplete', stop);
        router.events.on('routeChangeError', stop);

        return () => {
            router.events.off('routeChangeStart', start);
            router.events.off('routeChangeComplete', stop);
            router.events.off('routeChangeError', stop);
        };
    }, [router]);

    const style = {
        '--border-width': `3px`,
    } as React.CSSProperties;

    if (isLoading)
        return (
            <CustomGrid className={styles.spinner}>
                <section className={styles['sec-loading']} style={style}>
                    <div className={styles.one} />
                </section>
            </CustomGrid>
        );
    return null;
};
