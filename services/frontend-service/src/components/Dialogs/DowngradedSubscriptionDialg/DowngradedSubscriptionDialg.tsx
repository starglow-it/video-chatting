import {
	useEffect, useMemo, memo, useCallback 
} from 'react';
import {
	useStore 
} from 'effector-react';

// shared
import {
	plans 
} from 'shared-const';
import {
	CustomButton,
	CustomDialog,
	CustomGrid,
	CustomTypography,
} from 'shared-frontend';

// components
import {
	Translation 
} from '@library/common/Translation/Translation';

// stores
import {
	$appDialogsStore,
	$profileStore,
	appDialogsApi,
	updateProfileFx,
} from '../../../store';

// types
import {
	AppDialogsEnum 
} from '../../../store/types';

// styles
import styles from './DowngradedSubscriptionDialog.module.scss';

const Component = () => {
	const profile = useStore($profileStore);
	const {
		downgradedSubscriptionDialog 
	} = useStore($appDialogsStore);

	useEffect(() => {
		if (profile?.id && !profile?.isDowngradeMessageShown) {
			appDialogsApi.openDialog({
				dialogKey: AppDialogsEnum.downgradedSubscriptionDialog,
			});
		}
	}, [profile?.isDowngradeMessageShown]);

	const prevTemplatesNumber = useMemo(
		() =>
			plans[profile.previousSubscriptionPlanKey]?.features
				?.templatesLimit ?? 0,
		[profile.previousSubscriptionPlanKey],
	);

	const currentTemplatesNumber = useMemo(
		() => plans[profile.subscriptionPlanKey]?.features?.templatesLimit ?? 0,
		[profile.subscriptionPlanKey],
	);

	const handleConfirm = useCallback(() => {
		updateProfileFx({
			isDowngradeMessageShown: true,
		});

		appDialogsApi.closeDialog({
			dialogKey: AppDialogsEnum.downgradedSubscriptionDialog,
		});
	}, []);

	return (
		<CustomDialog
			open={downgradedSubscriptionDialog}
			contentClassName={styles.wrapper}
		>
			<CustomGrid
				container
				direction="column"
				alignItems="center"
				justifyContent="center"
			>
				<CustomTypography
					variant="h4bold"
					textAlign="center"
				>
					<Translation
						nameSpace="dashboard"
						translation="downgradedSubscription.title"
						options={{
							prevPlan: profile.previousSubscriptionPlanKey,
							currentPlan: profile.subscriptionPlanKey,
						}}
					/>
				</CustomTypography>
				<CustomTypography textAlign="center">
					<Translation
						nameSpace="dashboard"
						translation="downgradedSubscription.text"
						options={{
							prevTemplatesNumber,
							currentTemplatesNumber,
						}}
					/>
				</CustomTypography>
				<CustomButton
					className={styles.button}
					onClick={handleConfirm}
					label={
						<Translation
							nameSpace="common"
							translation="buttons.continue"
						/>
					}
				/>
			</CustomGrid>
		</CustomDialog>
	);
};

export const DowngradedSubscriptionDialog = memo(Component);
