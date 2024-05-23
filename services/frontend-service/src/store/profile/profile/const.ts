import { PlanKeys } from 'shared-types';
import { Profile } from '../../types';

export const initialProfileState = {
    id: '',
    fullName: '',
    position: '',
    profileAvatar: {
        id: '',
        url: '',
        size: 0,
        mimeType: '',
    },
    companyName: '',
    email: '',
    contactEmail: '',
    description: '',
    languages: [],
    socials: [],
    businessCategories: [],
    signBoard: 'default',
    subscriptionPlanKey: PlanKeys.House,
    nextSubscriptionPlanKey: PlanKeys.House,
    prevSubscriptionPlanKey: PlanKeys.House,
    stripeAccountId: '',
    stripeEmail: '',
    stripeSubscriptionId: '',
    stripeSeatSubscriptionId: '',
    renewSubscriptionTimestampInSeconds: 0,
    isStripeEnabled: false,
    isSubscriptionActive: false,
    maxTemplatesNumber: 0,
    maxMeetingTime: null,
    wasSuccessNotificationShown: false,
    country: '',
    isProfessionalTrialAvailable: false,
    shouldShowTrialExpiredNotification: false,
    teamMembers: []
} as Profile;
