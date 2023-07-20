import { memo } from 'react';

import { ErrorIcon } from 'shared-frontend/icons/OtherIcons/ErrorIcon';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

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
