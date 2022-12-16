import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useStore } from 'effector-react';

// shared
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomCheckbox } from 'shared-frontend/library/custom/CustomCheckbox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { useToggle } from 'shared-frontend/hooks/useToggle';
import { DoneIcon } from 'shared-frontend/icons/OtherIcons/DoneIcon';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomLink } from '@library/custom/CustomLink/CustomLink';
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';
import { Translation } from '@library/common/Translation/Translation';

// validations
import { MAX_CONTACT_US_MESSAGE_LENGTH } from 'src/const/general';
import { fullNameSchema } from '../../../validation/users/fullName';
import { simpleStringSchemaWithLength } from '../../../validation/common';
import { emailSchema } from '../../../validation/users/email';

// const
import { dashboardRoute } from '../../../const/client-routes';
import frontendConfig from 'src/const/config';

// types
import { ContactFormPayload } from '../../../store/types';

// store
import { $contactForm, changeContactFormData, sendContactFormFx } from '../../../store/other/contactUs/model';
import { $profileStore } from '../../../store';

// styles
import styles from './ContactUsForm.module.scss';

const validationSchema = yup.object({
    email: emailSchema().required('required'),
    name: fullNameSchema().required('required'),
    message: simpleStringSchemaWithLength(MAX_CONTACT_US_MESSAGE_LENGTH).required('required'),
});

const Component = () => {
    const router = useRouter();
    const profile = useStore($profileStore);
    const contactFormData = useStore($contactForm);

    const resolver = useYupValidationResolver<ContactFormPayload>(validationSchema);

    const methods = useForm<ContactFormPayload>({
        resolver,
        defaultValues: {
            email: contactFormData.email || profile.email,
            name: contactFormData.name || profile.fullName,
            message: contactFormData.message,
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = methods;

    const { onChange: onChangeMessage, ...restMessageProps } = useMemo(
        () => register('message'),
        [],
    );
    const nameProps = useMemo(() => register('name'), []);
    const emailProps = useMemo(() => register('email'), []);

    const { value: isSubmitButtonEnabled, onToggleSwitch: onToggleSubmitButtonEnabled } =
        useToggle(false);

    const { value: isAppealSent, onSwitchOn: onAppealSent } = useToggle(false);

    const isSendContactFormPending = useStore(sendContactFormFx.pending);

    const handleChangeMessage = useCallback(async event => {
        if (event.target.value.length > MAX_CONTACT_US_MESSAGE_LENGTH) {
            /* eslint-disable no-param-reassign */
            event.target.value = event.target.value.slice(0, MAX_CONTACT_US_MESSAGE_LENGTH);
            /* eslint-enable no-param-reassign */
        }

        await onChangeMessage(event);
    }, []);

    const onSubmit = useCallback(
        handleSubmit(async data => {
            const response = await sendContactFormFx({
                email: data.email,
                name: data.name,
                message: data.message,
            });
            if (response.success) {
                reset();
                onAppealSent();
            }
        }),
        [],
    );

    const handleClickHomepage = useCallback(() => {
        router.push(dashboardRoute);
    }, []);

    const errorName: string = errors?.name?.[0]?.message ?? '';
    const errorEmail: string = errors?.email?.[0]?.message ?? '';
    const errorMessage: string = errors?.message?.[0]?.message ?? '';

    useEffect(() => () => {
        const [name, email, message] = watch(['name', 'email', 'message']);
        changeContactFormData({
            name,
            email,
            message,
        });
    }, [contactFormData]);

    return (
        <CustomPaper className={styles.wrapper}>
            <FormProvider {...methods}>
                <form onSubmit={onSubmit}>
                    <ConditionalRender condition={!isAppealSent}>
                        <CustomGrid container direction="column" alignItems="center">
                            <CustomTypography
                                nameSpace="static"
                                translation="contacts.form.title"
                                variant="h3bold"
                                className={styles.title}
                            />
                            <CustomGrid item container justifyContent="center">
                                <CustomTypography
                                    nameSpace="static"
                                    translation="contacts.form.description"
                                    className={styles.description}
                                />
                                <CustomLink href={`mailto:${frontendConfig.supportEmail}`}>
                                    {frontendConfig.supportEmail}
                                </CustomLink>
                            </CustomGrid>
                            <CustomTypography
                                nameSpace="static"
                                translation="contacts.form.yourDetails"
                                variant="body1bold"
                                className={styles.subtitle}
                            />
                            <CustomGrid container flexWrap="nowrap" gap={3}>
                                <CustomInput
                                    nameSpace="static"
                                    translation="contacts.form.inputs.name.placeholder"
                                    error={errorName}
                                    {...nameProps}
                                />
                                <CustomInput
                                    nameSpace="static"
                                    translation="contacts.form.inputs.email.placeholder"
                                    error={errorEmail}
                                    {...emailProps}
                                />
                            </CustomGrid>
                            <CustomTypography
                                nameSpace="static"
                                translation="contacts.form.message"
                                variant="body1bold"
                                className={styles.subtitle}
                            />
                            <CustomGrid container>
                                <CustomInput
                                    multiline
                                    rows={3}
                                    nameSpace="static"
                                    translation="contacts.form.inputs.message.placeholder"
                                    error={errorMessage}
                                    onChange={handleChangeMessage}
                                    {...restMessageProps}
                                />
                            </CustomGrid>
                            <CustomCheckbox
                                onChange={onToggleSubmitButtonEnabled}
                                label={
                                    <CustomGrid>
                                        <CustomTypography
                                            className={styles.termsText}
                                            variant="body2"
                                            nameSpace="common"
                                            translation="iAgree"
                                        />
                                        &nbsp;
                                        <CustomLink
                                            className={clsx(styles.termsText, styles.termsLink)}
                                            href="/agreements"
                                            variant="body2"
                                            nameSpace="common"
                                            translation="terms"
                                        />
                                        &nbsp;
                                        <CustomTypography
                                            className={styles.termsText}
                                            variant="body2"
                                            nameSpace="common"
                                            translation="and"
                                        />
                                        &nbsp;
                                        <CustomLink
                                            className={clsx(styles.termsText, styles.termsLink)}
                                            href="/agreements?section=privacy"
                                            variant="body2"
                                            nameSpace="common"
                                            translation="privacy"
                                        />
                                    </CustomGrid>
                                }
                                labelClassName={styles.checkbox}
                            />
                            {isSendContactFormPending ? (
                                <CustomLoader className={styles.loader} />
                            ) : (
                                <CustomButton
                                    disabled={!isSubmitButtonEnabled}
                                    label={
                                        <Translation
                                            nameSpace="static"
                                            translation="contacts.form.actions.submit"
                                        />
                                    }
                                    type="submit"
                                    className={styles.submitButton}
                                />
                            )}
                        </CustomGrid>
                    </ConditionalRender>
                    <ConditionalRender condition={isAppealSent}>
                        <CustomGrid
                            container
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                            className={styles.success}
                        >
                            <DoneIcon width="48px" height="48px" className={styles.icon} />
                            <CustomTypography
                                nameSpace="static"
                                translation="contacts.success.title"
                                variant="h3bold"
                                className={clsx(styles.text, styles.title)}
                            />
                            <CustomTypography
                                nameSpace="static"
                                translation="contacts.success.description"
                                className={clsx(styles.text, styles.description)}
                            />
                            <CustomButton
                                label={
                                    <Translation
                                        nameSpace="static"
                                        translation="contacts.success.button"
                                    />
                                }
                                className={styles.button}
                                onClick={handleClickHomepage}
                            />
                        </CustomGrid>
                    </ConditionalRender>
                </form>
            </FormProvider>
        </CustomPaper>
    );
};

export const ContactUsForm = memo(Component);
