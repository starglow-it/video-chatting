import React, { memo, useCallback } from 'react';
import { useRouter } from 'next/router';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// icons
import { ArrowLeftIcon } from 'shared-frontend/icons/OtherIcons/ArrowLeftIcon';

// components
import { ContactUsForm } from '@components/Support/ContactUsForm/ContactUsForm';

// styles
import styles from './Support.module.scss';

const Component = () => {
    const router = useRouter();

    const handleGoBack = useCallback(() => {
        router.back();
    }, [router.back]);

    return (
        <CustomGrid className={styles.wrapper} container justifyContent="center">
            <CustomGrid
                container
                justifyContent="space-between"
                alignItems="center"
                wrap="nowrap"
                className={styles.chipsContainer}
            >
                <CustomGrid
                    container
                    justifyContent="center"
                    alignItems="center"
                    onClick={handleGoBack}
                    className={styles.backButton}
                >
                    <ArrowLeftIcon width="32px" height="32px" />
                </CustomGrid>
                <CustomGrid container alignItems="center" justifyContent="center" gap={1.5}>
                    <CustomImage src="/images/handshake.png" width="40px" height="40px" />
                    <CustomTypography variant="h1" nameSpace="static" translation="support.title" />
                </CustomGrid>
            </CustomGrid>
            <CustomGrid container className={styles.content}>
                <ContactUsForm />
            </CustomGrid>
        </CustomGrid>
    );
};

export const Support = memo(Component);
