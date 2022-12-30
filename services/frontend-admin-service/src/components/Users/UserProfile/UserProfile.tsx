import {
	memo, useCallback, useEffect 
} from 'react';
import { useStore } from 'effector-react';

import { ProfileAvatar } from 'shared-frontend/library/common/ProfileAvatar';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomDivider } from 'shared-frontend/library/custom/CustomDivider';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';

import { ArrowLeftIcon } from 'shared-frontend/icons/OtherIcons/ArrowLeftIcon';
import { LockIcon } from 'shared-frontend/icons/OtherIcons/LockIcon';
import { PersonIcon } from 'shared-frontend/icons/OtherIcons/PersonIcon';
import { StarIcon } from 'shared-frontend/icons/OtherIcons/StarIcon';
import { TrashIcon } from 'shared-frontend/icons/OtherIcons/TrashIcon';

import { Translation } from '@components/Translation/Translation';
import { UserProfileStatistic } from '@components/Users/UserProfileStatistic/UserProfileStatistic';
import { ProfileTemplateItem } from '@components/ProfileTemplateItem/ProfileTemplateItem';

import {
	$userProfileIdStore,
	$userProfileStore,
	$userProfileTemplateStore,
	getUserProfileFx,
	getUserProfileTemplateFx,
	openAdminDialogEvent,
	setBlockUserId,
	setDeleteUserId,
	setUserProfileIdEvent,
} from '../../../store';

import styles from './UserProfile.module.scss';
import { AdminDialogsEnum } from '../../../store/types';

const UserProfile = memo(() => {
	const {
		state: activeUserId 
	} = useStore($userProfileIdStore);
	const {
		state: userProfile 
	} = useStore($userProfileStore);
	const {
		state: favUserTemplate 
	} = useStore($userProfileTemplateStore);

	useEffect(() => {
		if (activeUserId) {
			getUserProfileFx({
				userId: activeUserId,
			});
			getUserProfileTemplateFx({
				userId: activeUserId,
				sort: 'timesUsed',
				direction: -1,
				limit: 1,
			});
		}
	}, [activeUserId]);

	const handleBlockUser = useCallback(() => {
		setBlockUserId(activeUserId);
		openAdminDialogEvent(AdminDialogsEnum.blockUserDialog);
	}, [activeUserId]);

	const handleDeleteUser = useCallback(() => {
		setDeleteUserId(activeUserId);
		openAdminDialogEvent(AdminDialogsEnum.deleteUserDialog);
	}, [activeUserId]);

	const handleResetUserId = useCallback(() => {
		setUserProfileIdEvent('');
	}, []);

	return (
		<CustomPaper className={styles.wrapper}>
			<CustomGrid
				container
				justifyContent="center"
				alignItems="center"
				onClick={handleResetUserId}
				className={styles.backButton}
			>
				<ArrowLeftIcon
					width="32px"
					height="32px"
				/>
			</CustomGrid>
			<CustomGrid
				container
				direction="column"
				alignItems="center"
			>
				<CustomGrid
					className={styles.profileInfoWrapper}
					container
					direction="row"
					flexWrap="nowrap"
					gap={1.5}
				>
					<CustomGrid className={styles.profileAvatarWrapper}>
						<ProfileAvatar
							className={styles.profileImage}
							width="60px"
							height="60px"
							src={userProfile?.profileAvatar?.url}
							userName={userProfile?.fullName}
						/>
					</CustomGrid>
					<CustomGrid
						container
						direction="column"
						flexWrap="nowrap"
						className={styles.descriptionWrapper}
					>
						<CustomTypography
							className={styles.companyName}
							variant="h4bold"
						>
							{userProfile?.companyName}
						</CustomTypography>
						<CustomTypography
							className={styles.profileEmail}
							variant="body2"
							color="colors.blue.primary"
						>
							{userProfile?.email}
						</CustomTypography>
					</CustomGrid>
					<CustomGrid
						container
						gap={1.5}
						alignItems="center"
						wrap="nowrap"
						className={styles.buttons}
					>
						<CustomButton
							className={styles.button}
							variant="custom-common"
							label={
								<Translation
									nameSpace="common"
									translation={
										userProfile?.isBlocked
											? 'buttons.unblock'
											: 'buttons.block'
									}
								/>
							}
							onClick={handleBlockUser}
							Icon={<LockIcon
								width="24px"
								height="24px"
							      />}
						/>
						<CustomButton
							className={styles.button}
							variant="custom-common"
							label={
								<Translation
									nameSpace="common"
									translation="buttons.delete"
								/>
							}
							onClick={handleDeleteUser}
							Icon={<TrashIcon
								width="24px"
								height="24px"
							      />}
						/>
					</CustomGrid>
				</CustomGrid>
				<CustomDivider
					className={styles.divider}
					light
				/>
				<CustomGrid
					container
					direction="column"
				>
					<CustomGrid
						display="grid"
						gridTemplateColumns="200px 200px"
						gridTemplateRows="repeat(4, min-content)"
						className={styles.profileInfo}
					>
						<CustomGrid
							container
							gridArea="1/1/1/1"
							className={styles.title}
						>
							<PersonIcon
								className={styles.personIcon}
								width="24px"
								height="24px"
							/>
							<CustomTypography
								variant="body1"
								fontWeight="600"
							>
								<Translation
									nameSpace="profile"
									translation="personalInfo.title"
								/>
							</CustomTypography>
						</CustomGrid>
						<CustomTypography
							gridArea="2/1/2/1"
							variant="body2"
							color="colors.grayscale.normal"
						>
							<Translation
								nameSpace="profile"
								translation="personalInfo.name"
							/>
						</CustomTypography>
						<CustomTypography
							gridArea="3/1/3/1"
							variant="body2"
							color="colors.grayscale.normal"
						>
							<Translation
								nameSpace="profile"
								translation="personalInfo.status"
							/>
						</CustomTypography>
						<CustomTypography
							gridArea="4/1/4/1"
							variant="body2"
							color="colors.grayscale.normal"
						>
							<Translation
								nameSpace="profile"
								translation="personalInfo.subscription"
							/>
						</CustomTypography>
						<CustomTypography
							gridArea="2/2/2/2"
							variant="body2"
						>
							{userProfile?.fullName}
						</CustomTypography>
						<CustomTypography
							gridArea="3/2/3/2"
							variant="body2"
						>
							{userProfile?.isStripeEnabled
								? 'Enabled'
								: 'Disabled'}
						</CustomTypography>
						<CustomTypography
							gridArea="4/2/4/2"
							variant="body2"
						>
							{userProfile?.subscriptionPlanKey}
						</CustomTypography>
					</CustomGrid>
					<UserProfileStatistic />
					<CustomDivider
						className={styles.divider}
						light
					/>
					<CustomGrid
						container
						direction="column"
						gap={1}
					>
						<CustomGrid
							container
							alignItems="center"
						>
							<StarIcon
								width="25px"
								height="24px"
								className={styles.icon}
							/>
							<CustomTypography>
								<Translation
									nameSpace="profile"
									translation="room.title"
								/>
							</CustomTypography>
                            &nbsp;
							<CustomTypography color="colors.grayscale.normal">
                                &#8226;
							</CustomTypography>
                            &nbsp;
							<CustomTypography color="colors.grayscale.normal">
								<Translation
									nameSpace="profile"
									translation="room.text"
								/>
							</CustomTypography>
						</CustomGrid>
						<ConditionalRender
							condition={Boolean(favUserTemplate?.id)}
						>
							<ProfileTemplateItem template={favUserTemplate} />
						</ConditionalRender>
					</CustomGrid>
				</CustomGrid>
			</CustomGrid>
		</CustomPaper>
	);
});

UserProfile.displayName = 'UserProfile';

export { UserProfile };
