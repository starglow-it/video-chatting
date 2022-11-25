import React, { memo, useCallback } from 'react';
import { useStore } from 'effector-react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import clsx from 'clsx';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomGrid } from 'shared-frontend/library';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomLink } from '@library/custom/CustomLink/CustomLink';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomButton } from 'shared-frontend/library';

// validation
import { MeetingAccessStatusEnum } from 'shared-types';
import { Translation } from '@library/common/Translation/Translation';
import { fullNameSchema } from '../../validation/users/fullName';

// stores
import {$profileStore, $authStore, $isSocketConnected} from '../../store';
import {
    $isOwner,
    $localUserStore,
    $meetingTemplateStore,
    updateLocalUserEvent,
} from '../../store/roomStores';

// types

// styles
import styles from './EnterMeetingName.module.scss';

const validationSchema = yup.object({
    fullName: fullNameSchema().required('required'),
});

const Component = () => {
    const { isAuthenticated } = useStore($authStore);
    const profile = useStore($profileStore);
    const localUser = useStore($localUserStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isSocketConnected = useStore($isSocketConnected);

    const isOwner = useStore($isOwner);

    const resolver = useYupValidationResolver<{
        fullName: string;
    }>(validationSchema);

    const { isMobile } = useBrowserDetect();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        criteriaMode: 'all',
        resolver,
        defaultValues: {
            fullName: isOwner ? meetingTemplate.fullName : localUser.username || profile.fullName,
        },
    });

    const fullNameRegister = register('fullName');

    const onSubmit = useCallback(
        handleSubmit(data => {
            updateLocalUserEvent({
                username: data.fullName,
                accessStatus: MeetingAccessStatusEnum.Settings,
            });
        }),
        [],
    );

    const fullNameError = errors.fullName?.[0]?.message;

    return (
        <CustomGrid
            container
            direction="column"
            className={clsx({ [styles.contentWrapper]: isMobile })}
        >
            <CustomTypography
                variant="h3bold"
                nameSpace="meeting"
                textAlign={isMobile ? 'center' : 'left'}
                translation="enterName.title"
            />
            <CustomGrid container direction="column" flex="1 1 auto">
                <CustomGrid container justifyContent={isMobile ? 'center' : 'left'}>
                    <CustomTypography
                        className={styles.title}
                        nameSpace="meeting"
                        translation="enterName.text.part1"
                    />
                    {!isAuthenticated && (
                        <>
                            &nbsp;
                            <CustomTypography
                                nameSpace="meeting"
                                translation="enterName.text.part2"
                            />
                            &nbsp;
                            <CustomLink
                                href="/login"
                                nameSpace="meeting"
                                translation="enterName.text.part3"
                            />
                            &nbsp;
                            <CustomTypography
                                nameSpace="meeting"
                                translation="enterName.text.part4"
                            />
                        </>
                    )}
                </CustomGrid>

                <form onSubmit={onSubmit} className={styles.formContent}>
                    <CustomInput
                        nameSpace="forms"
                        translation="yourName"
                        value={fullNameRegister.value}
                        onChange={fullNameRegister.onChange}
                        onBlur={fullNameRegister.onBlur}
                        ref={fullNameRegister.ref}
                        name={fullNameRegister.name}
                        error={fullNameError}
                    />
                    <CustomButton
                        disabled={!isSocketConnected}
                        className={clsx(styles.button, { [styles.mobile]: isMobile })}
                        type="submit"
                        label={<Translation nameSpace="meeting" translation="buttons.continue" />}
                    />
                </form>
            </CustomGrid>
        </CustomGrid>
    );
};

export const EnterMeetingName = memo(Component);
