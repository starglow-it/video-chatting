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
import {CustomGrid} from "shared-frontend/library/custom/CustomGrid";
import {CustomTypography} from "shared-frontend/library/custom/CustomTypography";
import {CustomButton} from "shared-frontend/library/custom/CustomButton";
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';

// components
import {
	Translation
} from '@library/common/Translation/Translation';

// stores
import {
    $appDialogsStore,
    $profileStore,
    appDialogsApi,
    updateProfileFx
} from '../../../store';

// utils
import {formatDate} from "../../../utils/time/formatDate";

// types
import {
	AppDialogsEnum
} from '../../../store/types';

// styles
import styles from './DowngradedSubscriptionDialog.module.scss';

const Component = () => {
    const profile = useStore($profileStore);

    const { downgradedSubscriptionDialog } = useStore($appDialogsStore);

    useEffect(() => {
        if (profile?.id && !profile?.isDowngradeMessageShown) {
            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.downgradedSubscriptionDialog,
            });
        }
    }, [profile?.isDowngradeMessageShown]);

    const nextTemplatesNumber = useMemo(() => plans[profile.nextSubscriptionPlanKey]?.features?.templatesLimit ?? 0, [profile.nextSubscriptionPlanKey]);
    const prevTemplatesNumber = useMemo(() => plans[profile.prevSubscriptionPlanKey]?.features?.templatesLimit ?? 0, [profile.prevSubscriptionPlanKey]);
    const currentTemplatesNumber = useMemo(() => plans[profile.subscriptionPlanKey]?.features?.templatesLimit ?? 0, [profile.subscriptionPlanKey]);

	const handleConfirm = useCallback(() => {
		updateProfileFx({
			isDowngradeMessageShown: true,
		});

		appDialogsApi.closeDialog({
			dialogKey: AppDialogsEnum.downgradedSubscriptionDialog,
		});
	}, []);

    const dueDate = profile?.renewSubscriptionTimestampInSeconds
        ? formatDate((profile?.renewSubscriptionTimestampInSeconds) * 1000, 'dd MMM, yyyy')
        : '';

    return (
        <CustomDialog open={downgradedSubscriptionDialog} contentClassName={styles.wrapper}>
            <CustomGrid container direction="column" alignItems="center" justifyContent="center">
                <CustomTypography variant="h4bold" textAlign="center">
                    <Translation
                        nameSpace="dashboard"
                        translation={`downgradedSubscription.${profile.nextSubscriptionPlanKey ? 'manual' : 'auto'}.title`}
                        options={{
                            prevPlan: profile.prevSubscriptionPlanKey,
                            nextPlan: profile.nextSubscriptionPlanKey,
                            currentPlan: profile.subscriptionPlanKey,
                        }}
                    />
                </CustomTypography>
                <CustomTypography textAlign="center">
                    <Translation
                        nameSpace="dashboard"
                        translation={`downgradedSubscription.${profile.nextSubscriptionPlanKey ? 'manual' : 'auto'}.text`}
                        options={{
                            dueDate,
                            prevTemplatesNumber,
                            nextTemplatesNumber,
                            currentTemplatesNumber,
                        }}
                    />
                </CustomTypography>
                <CustomButton
                    className={styles.button}
                    onClick={handleConfirm}
                    label={<Translation nameSpace="common" translation="buttons.continue" />}
                />
            </CustomGrid>
        </CustomDialog>
    );
};

export const DowngradedSubscriptionDialog = memo(Component);
