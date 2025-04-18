import { memo, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';

// library
import { PasswordInput } from '@library/common/PasswordInput/PasswordInput';
import { Translation } from '@library/common/Translation/Translation';

import styles from './EnterPasswordForm.module.scss';

const EnterPasswordForm = memo(
    ({
        onPasswordEntered,
        onCancel,
    }: {
        onPasswordEntered: () => void;
        onCancel: () => void;
    }) => {
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
                    error={errors?.password?.message?.toString()}
                    errorClassName={styles.error}
                    {...register('password')}
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
                        onClick={handleContinueStep}
                    />
                </CustomGrid>
            </CustomGrid>
        );
    },
);

export { EnterPasswordForm };
