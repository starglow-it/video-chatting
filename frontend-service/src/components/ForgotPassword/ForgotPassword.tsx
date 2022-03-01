import React, { memo } from 'react';

import { CustomLink } from '@library/custom/CustomLink/CustomLink';

import { ForgotPasswordProps } from './types';

const ForgotPassword = memo(({ className }: ForgotPasswordProps) => (
    <CustomLink
        href="/"
        className={className}
        variant="body2"
        nameSpace="common"
        translation="forgotPassword"
    />
));

export { ForgotPassword };
