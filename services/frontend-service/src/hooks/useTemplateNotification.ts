import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { addNotificationEvent } from '../store';

import { NotificationType } from '../store/types';

export const useTemplateNotification = (updateUrl: string) => {
    const router = useRouter();

    useEffect(() => {
        if (router.query.success === 'true' && router.query.session_id) {
            router.push(updateUrl, updateUrl, { shallow: true });

            addNotificationEvent({
                type: NotificationType.SubscriptionSuccess,
                message: `subscriptions.templateSuccess`,
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
    }, []);
};
