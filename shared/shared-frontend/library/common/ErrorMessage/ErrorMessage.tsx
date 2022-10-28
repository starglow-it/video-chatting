import React, { memo } from 'react';

import { ErrorIcon } from '../../../icons';

import CustomTypography from '../../custom/CustomTypography/CustomTypography';
import CustomGrid from '../../custom/CustomGrid/CustomGrid';
import ConditionalRender from "../ConditionalRender/ConditionalRender";

import { ErrorMessageProps } from './ErrorMessage.types';

const Component = ({ className, error, children }: React.PropsWithChildren<ErrorMessageProps>) => {
    return (
        <ConditionalRender condition={error}>
            <CustomGrid container alignItems="center" className={className}>
                <ErrorIcon width="15px" height="15px" />
                <CustomTypography
                    variant="body3"
                    color="error.main"
                >
                    {children}
                </CustomTypography>
            </CustomGrid>
        </ConditionalRender>
    );
}

const ErrorMessage = memo(Component);

export default ErrorMessage;
