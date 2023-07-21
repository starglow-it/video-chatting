import * as contactUs from './other/contactUs/init';
import * as socket from './socket/init';
import * as auth from './auth/init';
import * as register from './register/init';
import * as notifications from './notifications/init';
import * as profile from './profile/profile/init';
import * as profileTemplates from './profile/profileTemplates/init';
import * as profileTemplate from './profile/profileTemplate/init';
import * as payments from './payments/init';
import * as subscriptionsProducts from './subscriptions/products/init';
import * as subscription from './subscriptions/subscription/init';
import * as windowUI from './ui/window/init';
import * as goods from './ui/goods/init';
import * as orientation from './ui/orientation/init';
import * as UI from './ui/init';
import * as businessCategories from './businessCategories/init';
import * as featuredBackground from './featuredBackground/init';
import * as meetings from './meetings/init';
import * as routeToChange from './other/routeToChange/init';
import * as profileAvatarSetUp from './other/profileAvatarSetUp/init';
import * as version from './other/version/init';
import * as templates from './templates/init';

export * from './root';

export * from './socket/model';

export * from './auth/model';
export * from './dialogs/model';
export * from './register/model';
export * from './notifications/model';
export * from './profile/profile/model';
export * from './profile/profileTemplates/model';
export * from './profile/profileTemplate/model';
export * from './payments/model';
export * from './subscriptions/products/model';
export * from './subscriptions/subscription/model';

export * from './other/routeToChange/model';
export * from './other/profileAvatarSetUp/model';
export * from './other/version/model';

export * from './meetings/model';

export * from './templates/model';
export * from './waitingRoom/model';
export * from './dashboardNotifications/model';
export * from './ui/window/model';
export * from './ui/goods/model';
export * from './ui/orientation/model';
export * from './ui/model';
export * from './businessCategories/model';
export * from './featuredBackground/model';

export * from './dialogs/init';
export * from './waitingRoom/init';
export * from './dashboardNotifications/init';

export default {
    contactUs,
    socket,
    auth,
    register,
    notifications,
    profile,
    profileAvatarSetUp,
    profileTemplate,
    profileTemplates,
    payments,
    subscription,
    subscriptionsProducts,
    windowUI,
    goods,
    UI,
    orientation,
    businessCategories,
    featuredBackground,
    meetings,
    version,
    templates,
    routeToChange,
};
