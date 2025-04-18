import { memo, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

// custom
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { Translation } from '@library/common/Translation/Translation';

const EnterEmailForm = memo(
    ({
        onEmailEntered,
        onCancel,
    }: {
        onEmailEntered: () => void;
        onCancel: () => void;
    }) => {
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
                    error={errors?.email?.message?.toString()}
                    {...register('email')}
                />
                <CustomGrid container gap={2} wrap="nowrap">
                    <CustomButton
                        variant="custom-cancel"
                        label={
                            <Translation
                                nameSpace="common"
                                translation="buttons.cancel"
                            />
                        }
                        onClick={onCancel}
                    />
                    <CustomButton
                        label={
                            <Translation
                                nameSpace="common"
                                translation="buttons.continue"
                            />
                        }
                        onClick={handleContinue}
                    />
                </CustomGrid>
            </CustomGrid>
        );
    },
);

export { EnterEmailForm };
