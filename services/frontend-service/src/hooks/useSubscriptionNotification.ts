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
        if (subscription?.id) {
            const planName = profile.subscriptionPlanKey;

            if (router.query.success === 'true' && router.query.session_id) {
                router.push(updateUrl, updateUrl, { shallow: true });

                addNotificationEvent({
                    type: NotificationType.SubscriptionSuccess,
                    message: `subscriptions.subscription${planName}${isTrial ? 'Trial' : ''}Success`,
                    withSuccessIcon: true,
                });
            }
            if (router.query.cancel === 'true') {
                router.push(updateUrl, updateUrl, { shallow: true });

                addNotificationEvent({
                    type: NotificationType.SubscriptionSuccess,
                    message: `subscriptions.subscriptionFail`,
                    withSuccessIcon: true,
                });
            }
        }
    }, [subscription?.id]);
};
