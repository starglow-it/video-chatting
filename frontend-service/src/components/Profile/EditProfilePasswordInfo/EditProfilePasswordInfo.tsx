import React, { memo, useCallback, useMemo } from 'react';
import * as yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';

// hooks
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { PasswordInput } from '@library/common/PasswordInput/PasswordInput';
import { PasswordHints } from '@library/common/PasswordHints/PasswordHints';
import { updateProfilePasswordFx } from 'src/store';
import { useYupValidationResolver } from '../../../hooks/useYupValidationResolver';
import { useToggle } from '../../../hooks/useToggle';

// custom

// library

// validations
import { passwordLoginSchema, passwordSchema } from '../../../validation/users/password';
import { simpleStringSchema } from '../../../validation/common';

// stores
import { addNotificationEvent } from '../../../store';

// types
import { NotificationType } from '../../../store/types';
import { EditProfilePasswordInfoProps } from './types';

const validationSchema = yup.object({
    currentPassword: passwordLoginSchema().required('required'),
    newPassword: passwordSchema().required('user.pass.newPassword.new'),
    newPasswordRepeat: simpleStringSchema().required('user.pass.newPassword.newRepeat'),
});

const EditProfilePasswordInfo = memo(({ onCancel, onChanged }: EditProfilePasswordInfoProps) => {
    const resolver = useYupValidationResolver<{
        currentPassword: string;
        newPassword: string;
        newPasswordRepeat: boolean;
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
                const isNewPasswordError = result?.message.includes('newPassword');
                const key = isNewPasswordError ? 'newPassword' : 'currentPassword';

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
            return errors?.newPassword?.find(item => item.type === 'required')?.message;
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
                        />
                        <PasswordHints fieldKey="newPassword" show={showHints} />
                    </CustomGrid>
                    <PasswordInput
                        fieldKey="newPasswordRepeat"
                        nameSpace="profile"
                        translation="editProfile.newPasswordRepeat"
                        error={errors?.newPasswordRepeat?.[0]?.message}
                        {...register('newPasswordRepeat')}
                    />
                    <CustomGrid container gap={2} wrap="nowrap">
                        <CustomButton
                            onClick={onCancel}
                            variant="custom-cancel"
                            nameSpace="common"
                            translation="buttons.cancel"
                        />
                        <CustomButton type="submit" nameSpace="common" translation="buttons.save" />
                    </CustomGrid>
                </CustomGrid>
            </form>
        </FormProvider>
    );
});

export { EditProfilePasswordInfo };
