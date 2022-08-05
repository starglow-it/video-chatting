import {$profileStore, $subscriptionStore, addNotificationEvent} from "../store";
import {NotificationType} from "../store/types";
import {useStore} from "effector-react";
import { useEffect } from "react";
import {useRouter} from "next/router";

export const useSubscriptionNotification = () => {
    const router = useRouter();

    const subscription = useStore($subscriptionStore);
    const profile = useStore($profileStore);

    useEffect(() => {
        if (subscription?.id) {
            const planName = profile.subscriptionPlanKey;

            if (router.query.success === "true" && router.query.session_id) {
                router.push(`/meeting/${router.query.token}`, `/meeting/${router.query.token}`, { shallow: true });

                addNotificationEvent({
                    type: NotificationType.SubscriptionSuccess,
                    message: `subscriptions.subscription${planName}Success`,
                    withSuccessIcon: true,
                });
            }
            if (router.query.cancel === "true") {
                router.push(`/meeting/${router.query.token}`, `/meeting/${router.query.token}`, { shallow: true });

                addNotificationEvent({
                    type: NotificationType.SubscriptionSuccess,
                    message: `subscriptions.subscriptionFail`,
                    withSuccessIcon: true,
                });
            }
        }
    }, [subscription?.id]);
}