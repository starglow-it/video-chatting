import React, { memo } from 'react';

import { ErrorIcon } from '@library/icons/ErrorIcon';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

import { ErrorMessageProps } from './types';

const ErrorMessage = memo(({ className, error }: ErrorMessageProps) => {
    return (
        <CustomGrid container alignItems="center" className={className}>
            {error ? <ErrorIcon width="15px" height="15px" /> : null}
            <CustomTypography
                variant="body3"
                color="error.main"
                nameSpace="errors"
                translation={error}
            />
        </CustomGrid>
    );
});

export { ErrorMessage };
