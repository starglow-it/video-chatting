import React, { memo } from 'react';

import { ErrorIcon } from 'shared-frontend/icons';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from 'shared-frontend/library';

import { ErrorMessageProps } from './types';

const ErrorMessage = memo(({ className, error }: ErrorMessageProps) => {
    if (error) {
        return (
            <CustomGrid container alignItems="center" className={className}>
                <ErrorIcon width="15px" height="15px" />
                <CustomTypography
                    variant="body3"
                    color="error.main"
                    nameSpace="errors"
                    translation={error}
                />
            </CustomGrid>
        );
    }

    return null;
});

export { ErrorMessage };
