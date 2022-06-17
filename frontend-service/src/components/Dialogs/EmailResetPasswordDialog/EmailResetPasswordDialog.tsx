import {memo, useCallback} from "react";
import {useStore} from "effector-react";
import Image from 'next/image';
import {FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

// custom
import {CustomDialog} from "@library/custom/CustomDialog/CustomDialog";
import {CustomTypography} from "@library/custom/CustomTypography/CustomTypography";
import {CustomGrid} from "@library/custom/CustomGrid/CustomGrid";
import {CustomInput} from "@library/custom/CustomInput/CustomInput";
import {CustomButton} from "@library/custom/CustomButton/CustomButton";

// stores
import {$appDialogsStore, appDialogsApi} from "../../../store/dialogs";

// types
import {AppDialogsEnum} from "../../../store/types";

// styles
import styles from './EmailResetPasswordDialog.module.scss';

// hooks
import {useYupValidationResolver} from "../../../hooks/useYupValidationResolver";
import {useCountDown} from "../../../hooks/useCountDown";

// validations
import {emailSchema} from "../../../validation/users/email";
import {sendResetPasswordLinkFx} from "../../../store/profile";

const validationSchema = yup.object({
    email: emailSchema().required('required'),
});

const Component = () => {
    const { emailResetPasswordDialog } = useStore($appDialogsStore);

    const {
        value: timerValue,
        onStartCountDown: handleStartCountDown,
        onStopCountDown: handleStopCountDown,
    } = useCountDown(30);

    const resolver = useYupValidationResolver<{ email: string }>(validationSchema);

    const methods = useForm({
        criteriaMode: 'all',
        resolver,
    });

    const { reset, handleSubmit, register, formState: { errors, isSubmitSuccessful, isSubmitted } } = methods;

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.emailResetPasswordDialog,
        });
        reset();
        handleStopCountDown();
    }, []);

    const onSubmit = useCallback(handleSubmit(async (data) => {
        await sendResetPasswordLinkFx(data);
        handleStartCountDown();
    }), []);

    return (
        <CustomDialog contentClassName={styles.dialog} open={emailResetPasswordDialog} onClose={handleClose}>
            {!isSubmitSuccessful && !isSubmitted
                ? (
                    <>
                        <CustomGrid container direction="column" gap={1} alignItems="center" justifyContent="center">
                            <CustomGrid container alignItems="center" gap={1.25} justifyContent="center">
                                <Image src="/images/lock.png" width="28px" height="28px"/>
                                <CustomTypography variant="h2bold" nameSpace="common" translation="reset.title"/>
                            </CustomGrid>
                            <CustomTypography
                                textAlign="center"
                                className={styles.text}
                                nameSpace="common"
                                translation="reset.text"
                            />
                        </CustomGrid>
                        <FormProvider {...methods}>
                            <form onSubmit={onSubmit} className={styles.form}>
                                <CustomGrid container gap={5}>
                                    <CustomInput
                                        nameSpace="forms"
                                        translation="email"
                                        error={errors?.email?.[0]?.message}
                                        {...register('email')}
                                    />
                                    <CustomButton
                                        type="submit"
                                        nameSpace="common"
                                        translation="reset.sendLink"
                                    />
                                </CustomGrid>
                            </form>
                        </FormProvider>
                    </>
                )
                : (
                    <CustomGrid container direction="column" alignItems="center" justifyContent="center">
                            <Image src="/images/email2.png" width="52px" height="52px" />
                            <CustomTypography className={styles.title} variant="h2bold" nameSpace="common" translation="reset.checkEmail" />
                            <CustomTypography textAlign="center" className={styles.text} nameSpace="common" translation="reset.checkEmailText" />
                            <CustomGrid container justifyContent="center" gap={1} className={styles.resend}>
                                <CustomTypography nameSpace="common" translation="reset.didntGetLink" />
                                {timerValue
                                    ? (
                                        <CustomTypography
                                            nameSpace="common"
                                            translation="reset.resendTimer"
                                            color="colors.grayscale.normal"
                                            options={{ time: timerValue }}
                                        />
                                    )
                                    : (
                                        <CustomTypography
                                            variant="body1bold"
                                            color="colors.blue.primary"
                                            onClick={onSubmit}
                                            nameSpace="common"
                                            translation="reset.resend"
                                            className={styles.resendButton}
                                        />
                                    )
                                }
                            </CustomGrid>
                        </CustomGrid>
                )
            }
        </CustomDialog>
    );
}

export const EmailResetPasswordDialog = memo(Component);