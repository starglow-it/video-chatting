import React, { memo, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

// custom
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';

const EnterEmailForm = memo(
    ({ onEmailEntered, onCancel }: { onEmailEntered: () => void; onCancel: () => void }) => {
        const {
            register,
            trigger,
            formState: { errors },
        } = useFormContext();

        const handleContinue = useCallback(async () => {
            const isValid = await trigger('email');

            if (isValid) {
                onEmailEntered();
            }
        }, [onEmailEntered]);

        return (
            <CustomGrid container direction="column" gap={3}>
                <CustomInput
                    nameSpace="profile"
                    translation="editProfile.newEmail"
                    error={errors?.email?.[0]?.message}
                    {...register('email')}
                />
                <CustomGrid container gap={2} wrap="nowrap">
                    <CustomButton
                        nameSpace="common"
                        variant="custom-cancel"
                        translation="buttons.cancel"
                        onClick={onCancel}
                    />
                    <CustomButton
                        nameSpace="common"
                        translation="buttons.continue"
                        onClick={handleContinue}
                    />
                </CustomGrid>
            </CustomGrid>
        );
    },
);

export { EnterEmailForm };
