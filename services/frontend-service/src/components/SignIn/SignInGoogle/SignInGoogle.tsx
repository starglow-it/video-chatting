import { useCallback, useState } from 'react';
import clsx from 'clsx';

import { SocialLogin } from '@library/common/SocialLogin/SocialLogin';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';
import { PropsWithClassName } from 'shared-frontend/types';
import { addNotificationEvent, googleVerifyFx } from '../../../store';

import { NotificationType } from '../../../store/types';

import styles from './SignInGoogle.module.scss';
import frontendConfig from '../../../const/config';

export const SignInGoogle = ({
    buttonText = '',
    className,
}: PropsWithClassName<{ buttonText?: string }>) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const handleReject = (text: string) => {
        setIsProcessing(false);
        addNotificationEvent({
            type: NotificationType.validationError,
            message: text,
            withErrorIcon: true,
        });
    };

    const handleSuccess = (token: string) => {
        googleVerifyFx({
            token,
        }).then(() => {
            setIsProcessing(false);
            if (!localStorage.getItem("isFirstDashboardVisit")) {
                localStorage.setItem("isFirstDashboardVisit", "true");
            }

            if (!localStorage.getItem("isFirstMeeting")) {
                localStorage.setItem("isFirstMeeting", "true");
            }
        });
    };

    const loginGoogle = useCallback(() => {
        if (isProcessing) {
            return;
        }
        setIsProcessing(true);
        if (window) {
            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: frontendConfig.googleClientId,
                scope: 'email profile',
                callback: res => {
                    handleSuccess(res.access_token);
                },
                error_callback: err => {
                    handleReject(err.message);
                },
            });
            client.requestAccessToken();
        } else {
            handleReject('Failed to login to Google');
        }
    }, [isProcessing]);

    return (
        <SocialLogin
            className={clsx(
                styles.btnGoogle,
                {
                    [styles.btnProcessing]: isProcessing,
                },
                className,
            )}
            onClick={loginGoogle}
        >
            <ConditionalRender condition={isProcessing}>
                <CustomLoader />
            </ConditionalRender>
            <ConditionalRender condition={!isProcessing}>
                <CustomImage
                    src="/images/logo_google.svg"
                    width="28px"
                    height="27px"
                />
                <CustomTypography
                    nameSpace="common"
                    translation={buttonText || 'buttons.loginGoogle'}
                />
            </ConditionalRender>
        </SocialLogin>
    );
};
