import React, { memo, useCallback } from 'react';
import clsx from 'clsx';

// custom
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// stores
import { appDialogsApi } from '../../store';

// types
import { AppDialogsEnum } from '../../store/types';
import { ForgotPasswordProps } from './types';
import { PropsWithClassName } from 'shared-frontend/types';

// styles
import styles from './ForgotPassword.module.scss';

const Component = memo(({ className }: PropsWithClassName<ForgotPasswordProps>) => {
    const handleStartResetPassword = useCallback(() => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.emailResetPasswordDialog,
        });
    }, []);

    return (
        <CustomTypography
            className={clsx(styles.text, className)}
            variant="body2"
            nameSpace="common"
            translation="forgotPassword"
            color="colors.blue.primary"
            onClick={handleStartResetPassword}
        />
    );
});

export const ForgotPassword = memo<PropsWithClassName<ForgotPasswordProps>>(Component);
