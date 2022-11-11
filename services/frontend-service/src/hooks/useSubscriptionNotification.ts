import { useStore } from 'effector-react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NotificationType } from '../store/types';
import { $isTrial, $profileStore, $subscriptionStore, addNotificationEvent } from '../store';

export const useSubscriptionNotification = (updateUrl: string) => {
    const router = useRouter();

    const subscription = useStore($subscriptionStore);
    const profile = useStore($profileStore);
    const isTrial = useStore($isTrial);

    useEffect(() => {
        const isHouseSubscriptionSuccess = router.query.success_house === 'true';

        if (!subscription?.id && !isHouseSubscriptionSuccess) {
            return;
        }

        const planName = profile.subscriptionPlanKey;
        const isSucceed = router.query.success === 'true';
        const isCanceled = router.query.cancel === 'true';
        const hasSessionId = Boolean(router.query.session_id);

        let message = '';

        if (subscription?.id) {
            if (isSucceed && hasSessionId) {
                message = `subscriptions.subscription${planName}${isTrial ? 'Trial' : ''}Success`;
            } else if (isCanceled) {
                message = `subscriptions.subscriptionFail`;
            }
        } else if (isHouseSubscriptionSuccess) {
            message = `subscriptions.subscriptionHouseSuccess`;
        }

        addNotificationEvent({
            type: NotificationType.SubscriptionSuccess,
            message,
            withSuccessIcon: true,
        });
        router.push(updateUrl, updateUrl, { shallow: true });
    }, [subscription?.id]);
};
