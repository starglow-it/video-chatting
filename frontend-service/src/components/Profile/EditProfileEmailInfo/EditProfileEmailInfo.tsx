import React, { memo, useCallback } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';

// helpers
import { EnterCodeForm } from '@components/Profile/EnterCodeForm/EnterCodeForm';
import { EnterEmailForm } from '@components/Profile/EnterEmailForm/EnterEmailForm';
import { useToggle } from '../../../hooks/useToggle';
import {
    codeVerificationUrl,
    emailVerificationUrl,
    passwordVerificationUrl,
} from '../../../utils/urls';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';

// components
import { EnterPasswordForm } from '../EnterPasswordForm/EnterPasswordForm';

// validation
import { passwordLoginSchema } from '../../../validation/users/password';
import { emailSchema } from '../../../validation/users/email';
import { simpleStringSchemaWithLength } from '../../../validation/common';
import { useYupValidationResolver } from '../../../hooks/useYupValidationResolver';

// styles
import styles from './EditProfileEmailInfo.module.scss';

// stores
import { updateProfileEmailFx } from '../../../store';

// types
import { NotificationType } from '../../../store/types';
import { addNotificationEvent } from '../../../store';

const validationSchema = yup.object({
    password: passwordLoginSchema().required('required'),
    email: emailSchema().required('required'),
    code: simpleStringSchemaWithLength(7).required('required'),
});

const EditProfileEmailInfo = memo(
    ({ onCancel, onChanged }: { onCancel: () => void; onChanged: () => void }) => {
        const resolver = useYupValidationResolver<{
            password: string;
            email: string;
            code: string;
        }>(validationSchema);

        const methods = useForm({
            criteriaMode: 'all',
            resolver,
            defaultValues: {
                password: '',
                email: '',
                code: '',
            },
        });

        const { handleSubmit, control, setError, setFocus } = methods;

        const { value: isPasswordVerified, onSwitchOn: handleFinishPasswordEnter } =
            useToggle(false);

        const { value: isNewEmailEntered, onSwitchOn: handleFinishEmailEnter } = useToggle(false);

        const email = useWatch({
            control,
            name: 'email',
        });

        const code = useWatch({
            control,
            name: 'code',
        });

        const password = useWatch({
            name: 'password',
            control,
        });

        const handleCodeEntered = useCallback(
            async () =>
                sendRequestWithCredentials({
                    ...codeVerificationUrl,
                    data: { code, email },
                }),
            [email, code],
        );

        const handleCancelEdit = useCallback(() => {
            onCancel?.();
        }, []);

        const onSubmit = useCallback(
            handleSubmit(async data => {
                try {
                    await updateProfileEmailFx({ email: data.email });

                    onChanged();
                    addNotificationEvent({
                        type: NotificationType.PasswordChanged,
                        message: 'profile.emailChanged',
                    });
                } catch (e) {
                    throw new Error(e.message);
                }
            }),
            [],
        );

        const handlePasswordEntered = useCallback(async () => {
            const result = await sendRequestWithCredentials({
                ...passwordVerificationUrl,
                data: { password },
            });

            if (!result.success) {
                setError('password', [{ type: 'focus', message: 'user.pass.incorrect' }]);
                setFocus('password');
            } else {
                handleFinishPasswordEnter();
            }
        }, [password]);

        const handleEmailEntered = useCallback(async () => {
            const result = await sendRequestWithCredentials({
                ...emailVerificationUrl,
                data: { email },
            });

            if (result.success) {
                handleFinishEmailEnter();
            } else {
                setError('email', [{ type: 'focus', message: result?.error?.message }]);
                setFocus('email');
            }
        }, [email]);

        const handleResendCode = useCallback(async () => {
            await sendRequestWithCredentials({
                ...emailVerificationUrl,
                data: { email },
            });
        }, [email]);

        return (
            <FormProvider {...methods}>
                <form onSubmit={onSubmit} className={styles.form}>
                    {!isPasswordVerified && !isNewEmailEntered && (
                        <EnterPasswordForm
                            onPasswordEntered={handlePasswordEntered}
                            onCancel={handleCancelEdit}
                        />
                    )}
                    {isPasswordVerified && !isNewEmailEntered && (
                        <EnterEmailForm
                            onEmailEntered={handleEmailEntered}
                            onCancel={handleCancelEdit}
                        />
                    )}
                    {isPasswordVerified && isNewEmailEntered && (
                        <EnterCodeForm
                            onCodeEntered={handleCodeEntered}
                            onCancel={handleCancelEdit}
                            onResendCode={handleResendCode}
                        />
                    )}
                </form>
            </FormProvider>
        );
    },
);

export { EditProfileEmailInfo };
