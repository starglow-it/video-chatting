import React, { memo, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';

// library
import { PasswordInput } from '@library/common/PasswordInput/PasswordInput';

const EnterPasswordForm = memo(
    ({ onPasswordEntered, onCancel }: { onPasswordEntered: () => void; onCancel: () => void }) => {
        const {
            register,
            trigger,
            formState: { errors },
        } = useFormContext();

        const handleContinueStep = useCallback(async () => {
            const isValid = await trigger('password');

            if (isValid) {
                onPasswordEntered();
            }
        }, [onPasswordEntered]);

        return (
            <CustomGrid container direction="column" gap={3}>
                <PasswordInput
                    nameSpace="profile"
                    translation="editProfile.password"
                    error={errors?.password?.[0]?.message}
                    {...register('password')}
                />
                <CustomGrid container gap={2} wrap="nowrap">
                    <CustomButton
                        nameSpace="common"
                        variant="custom-cancel"
                        translation="buttons.cancel"
                        onClick={onCancel}
                    />
                    <CustomButton
                        onClick={handleContinueStep}
                        nameSpace="common"
                        translation="buttons.continue"
                    />
                </CustomGrid>
            </CustomGrid>
        );
    },
);

export { EnterPasswordForm };
