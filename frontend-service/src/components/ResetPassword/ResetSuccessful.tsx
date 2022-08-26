import React, { memo, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// const
import { clientRoutes } from '../../const/client-routes';

const Component = () => {
    const router = useRouter();
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        timeoutRef.current = setTimeout(() => {
            router.push(clientRoutes.loginRoute);
        }, 3000);

        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <CustomGrid
            container
            direction="column"
            gap={2}
            alignItems="center"
            justifyContent="center"
        >
            <CustomTypography
                variant="h2bold"
                nameSpace="common"
                translation="reset.resetSuccessful.title"
            />
            <CustomTypography nameSpace="common" translation="reset.resetSuccessful.text" />
        </CustomGrid>
    );
};

export const ResetSuccessful = memo(Component);
