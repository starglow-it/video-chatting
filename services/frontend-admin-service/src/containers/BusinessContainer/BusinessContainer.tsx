import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import styles from './BusinessContainer.module.scss';
import { BusinessCategories } from '@components/Business/Categories/Categories';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { Translation } from '@components/Translation/Translation';
import { useEffect } from 'react';
import { getBusinessCategoriesEvent } from 'src/store';

export const BusinessContainer = () => {
    useEffect(() => {
        getBusinessCategoriesEvent({});
    }, []);

    return (
        <CustomGrid
            container
            direction="column"
            alignItems="center"
            className={styles.wrapper}
        >
            <CustomGrid
                container
                justifyContent="center"
                alignItems="center"
                gap={1.5}
            >
                <CustomTypography variant="h1">
                    <Translation nameSpace="common" translation="Business" />
                </CustomTypography>
                <CustomGrid
                    container
                    justifyContent="center"
                    alignItems="flex-start"
                >
                    <BusinessCategories />
                </CustomGrid>
            </CustomGrid>
        </CustomGrid>
    );
};
