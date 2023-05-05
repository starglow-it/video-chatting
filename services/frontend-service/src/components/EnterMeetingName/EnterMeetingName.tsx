import React, {
	memo, useCallback, useEffect
} from 'react';
import {
	useStore
} from 'effector-react';
import {
	useForm
} from 'react-hook-form';
import * as yup from 'yup';
import clsx from 'clsx';

// hooks
import {
	useYupValidationResolver
} from '@hooks/useYupValidationResolver';
import {
	useBrowserDetect
} from '@hooks/useBrowserDetect';

// custom
import {
	CustomGrid
} from 'shared-frontend/library/custom/CustomGrid';
import {
	CustomTypography
} from '@library/custom/CustomTypography/CustomTypography';
import {
	CustomLink
} from '@library/custom/CustomLink/CustomLink';
import {
	CustomInput
} from '@library/custom/CustomInput/CustomInput';
import {
	CustomButton
} from 'shared-frontend/library/custom/CustomButton';

// validation
import {
	MeetingAccessStatusEnum
} from 'shared-types';
import {
	Translation
} from '@library/common/Translation/Translation';
import {
	fullNameSchema
} from '../../validation/users/fullName';

// stores
import {
    $profileStore,
    $authStore,
    $isSocketConnected
} from '../../store';
import {
    $isMeetingSocketConnecting,
    $isOwner,
    $localUserStore,
    $meetingTemplateStore, sendJoinWaitingRoomSocketEvent,
    updateLocalUserEvent,
} from '../../store/roomStores';

// types

// styles
import styles from './EnterMeetingName.module.scss';
import { useRouter } from 'next/router';

const validationSchema = yup.object({
	fullName: fullNameSchema().required('required'),
});

const Component = () => {
    const { isAuthenticated } = useStore($authStore);
		const router = useRouter();
    const profile = useStore($profileStore);
    const localUser = useStore($localUserStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isSocketConnected = useStore($isSocketConnected);
    const isMeetingSocketConnecting = useStore($isMeetingSocketConnecting);
    const isJoinWaitingRoomPending = useStore(sendJoinWaitingRoomSocketEvent.pending);

    const isOwner = useStore($isOwner);
		const nameOnUrl = router.query?.participantName as (string | undefined)
	const resolver = useYupValidationResolver<{
        fullName: string;
    }>(validationSchema);

	const {
		isMobile
	} = useBrowserDetect();

	const {
		register,
		handleSubmit,
		formState: {
 errors
},
	} = useForm({
		criteriaMode: 'all',
		resolver,
		defaultValues: {
			fullName: isOwner
				? meetingTemplate.fullName
				: nameOnUrl || localUser.username || profile.fullName,
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

	useEffect(() => {
		if(!!nameOnUrl){
			updateLocalUserEvent({
				username: nameOnUrl,
				accessStatus: MeetingAccessStatusEnum.Settings,
			});
		}
	}, [])
	return (
		<CustomGrid
			container
			direction="column"
			className={clsx({
				[styles.contentWrapper]: isMobile,
			})}
		>
			<CustomTypography
				variant="h3bold"
				nameSpace="meeting"
				textAlign={isMobile ? 'center' : 'left'}
				translation="enterName.title"
			/>
			<CustomGrid
				container
				direction="column"
				flex="1 1 auto"
			>
				<CustomGrid
					container
					justifyContent={isMobile ? 'center' : 'left'}
				>
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
                        autoComplete="given-name"
                        value={fullNameRegister.value}
                        onChange={fullNameRegister.onChange}
                        onBlur={fullNameRegister.onBlur}
                        ref={fullNameRegister.ref}
                        name={fullNameRegister.name}
                        error={fullNameError}
                    />
                    <CustomButton
                        disabled={!isSocketConnected || isMeetingSocketConnecting || isJoinWaitingRoomPending}
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
