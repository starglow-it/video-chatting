import React, { memo, useCallback, useMemo } from 'react';
import * as yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';
import { useToggle } from 'shared-frontend/hooks/useToggle';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';

// common
import { PasswordInput } from '@library/common/PasswordInput/PasswordInput';
import { PasswordHints } from '@library/common/PasswordHints/PasswordHints';
import { Translation } from '@library/common/Translation/Translation';

// validations
import {
    passwordLoginSchema,
    passwordSchema,
} from '../../../validation/users/password';
import { simpleStringSchema } from '../../../validation/common';

// stores
import { addNotificationEvent, updateProfilePasswordFx } from '../../../store';

// types
import { NotificationType } from '../../../store/types';
import { EditProfilePasswordInfoProps } from './types';

// styles
import styles from './EditProfilePasswordInfo.module.scss';

const validationSchema = yup.object({
    currentPassword: passwordLoginSchema().required('required'),
    newPassword: passwordSchema().required('user.pass.newPassword.new'),
    newPasswordRepeat: simpleStringSchema().required(
        'user.pass.newPassword.newRepeat',
    ),
});

const EditProfilePasswordInfo = memo(
    ({ onCancel, onChanged }: EditProfilePasswordInfoProps) => {
        const resolver = useYupValidationResolver<{
            currentPassword: string;
            newPassword: string;
            newPasswordRepeat: string;
        }>(validationSchema);

        const {
            value: showHints,
            onSwitchOn: handleShowHints,
            onSwitchOff: handleHideHints,
        } = useToggle(false);

        const methods = useForm({
            criteriaMode: 'all',
            resolver,
            defaultValues: {
                currentPassword: '',
                newPassword: '',
                newPasswordRepeat: '',
            },
        });

        const {
            handleSubmit,
            register,
            formState: { errors },
            setError,
        } = methods;

        const onSubmit = useCallback(
            handleSubmit(async data => {
                if (data.newPassword !== data.newPasswordRepeat) {
                    return setError('newPasswordRepeat', [
                        { message: 'user.pass.newPassword.notMatch' },
                    ]);
                }

                const result = await updateProfilePasswordFx(data);

                if (result?.message) {
                    const isNewPasswordError =
                        result?.message.includes('newPassword');
                    const key = isNewPasswordError
                        ? 'newPassword'
                        : 'currentPassword';

                    setError(key, { type: 'focus', message: result?.message });
                } else {
                    onChanged();
                    addNotificationEvent({
                        type: NotificationType.PasswordChanged,
                        message: 'profile.passwordChanged',
                    });
                }
            }),
            [],
        );

        const handleFocusInput = useCallback(() => {
            handleShowHints();
        }, []);

        const handleBlurInput = useCallback(() => {
            handleHideHints();
        }, []);

        const newPasswordErrorMessage = useMemo(() => {
            if (Array.isArray(errors?.newPassword)) {
                return errors?.newPassword?.find(
                    item => item.type === 'required',
                )?.message;
            }
            return errors?.newPassword?.message;
        }, [errors?.newPassword]);

        const currentPasswordErrorMessage = useMemo(() => {
            if (Array.isArray(errors?.newPassword)) {
                return errors?.currentPassword?.[0]?.message;
            }
            return errors?.currentPassword?.message;
        }, [errors?.currentPassword]);

        return (
            <FormProvider {...methods}>
                <form onSubmit={onSubmit} noValidate autoComplete="off">
                    <CustomGrid container direction="column" gap={3}>
                        <PasswordInput
                            fieldKey="currentPassword"
                            nameSpace="profile"
                            translation="editProfile.currentPassword"
                            error={currentPasswordErrorMessage}
                            errorClassName={styles.error}
                            {...register('currentPassword')}
                        />
                        <CustomGrid container>
                            <PasswordInput
                                fieldKey="newPassword"
                                nameSpace="profile"
                                translation="editProfile.newPassword"
                                onFocus={handleFocusInput}
                                error={newPasswordErrorMessage}
                                {...register('newPassword')}
                                onCustomBlur={handleBlurInput}
                                errorClassName={styles.error}
                            />
                            <PasswordHints
                                fieldKey="newPassword"
                                show={showHints}
                            />
                        </CustomGrid>
                        <PasswordInput
                            fieldKey="newPasswordRepeat"
                            nameSpace="profile"
                            translation="editProfile.newPasswordRepeat"
                            error={errors?.newPasswordRepeat?.[0]?.message}
                            errorClassName={styles.error}
                            {...register('newPasswordRepeat')}
                        />
                        <CustomGrid container gap={2} wrap="nowrap">
                            <CustomButton
                                onClick={onCancel}
                                label={
                                    <Translation
                                        nameSpace="common"
                                        translation="buttons.cancel"
                                    />
                                }
                                variant="custom-cancel"
                            />
                            <CustomButton
                                label={
                                    <Translation
                                        nameSpace="common"
                                        translation="buttons.save"
                                    />
                                }
                                type="submit"
                            />
                        </CustomGrid>
                    </CustomGrid>
                </form>
            </FormProvider>
        );
    },
);

export { EditProfilePasswordInfo };
