import React, { memo, useCallback } from 'react';
import { useStore } from 'effector-react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomLink } from '@library/custom/CustomLink/CustomLink';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';

// validation
import { fullNameSchema } from '../../validation/users/fullName';
import { useYupValidationResolver } from '../../hooks/useYuoValidationResolver';

// stores
import { updateLocalUserStateEvent } from '../../store/users';
import { $authStore } from '../../store/auth';
import { $meetingInstanceStore, $meetingTemplateStore } from '../../store/meeting';
import { $profileStore } from '../../store/profile';

// types
import { MeetingAccessStatuses } from '../../store/types';

// styles
import styles from './EnterMeetingName.module.scss';

const validationSchema = yup.object({
    fullName: fullNameSchema().required('required'),
});

const EnterMeetingName = memo(() => {
    const { isAuthenticated } = useStore($authStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const profile = useStore($profileStore);
    const meetingInstance = useStore($meetingInstanceStore);

    const isOwner = meetingInstance.owner === profile.id;

    const resolver = useYupValidationResolver<{
        fullName: string;
    }>(validationSchema);

    const { register, handleSubmit } = useForm({
        criteriaMode: 'all',
        resolver,
        defaultValues: {
            fullName: isOwner ? meetingTemplate.fullName : profile.fullName,
        },
    });

    const onSubmit = useCallback(
        handleSubmit(data => {
            updateLocalUserStateEvent({
                username: data.fullName,
                accessStatus: MeetingAccessStatuses.Waiting,
            });
        }),
        [],
    );

    return (
        <CustomPaper className={styles.wrapper}>
            <CustomGrid container direction="column">
                <CustomTypography
                    variant="h3bold"
                    nameSpace="meeting"
                    translation="enterName.title"
                />
                <CustomGrid container>
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
                    <form onSubmit={onSubmit} className={styles.formContent}>
                        <CustomInput
                            nameSpace="forms"
                            translation="yourName"
                            {...register('fullName')}
                        />
                        <CustomButton
                            className={styles.button}
                            type="submit"
                            nameSpace="meeting"
                            translation="buttons.continue"
                        />
                    </form>
                </CustomGrid>
            </CustomGrid>
        </CustomPaper>
    );
});

export { EnterMeetingName };
