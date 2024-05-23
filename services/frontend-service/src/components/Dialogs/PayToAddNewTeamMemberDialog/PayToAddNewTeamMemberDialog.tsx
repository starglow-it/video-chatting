import { useCallback, useEffect } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

//store
import {
    $appDialogsStore,
    $isConnectedStripe,
    $profileStore,
    $seatProductsStore,
    appDialogsApi,
    connectStripeAccountFx,
    addNotificationEvent,
    updateProfileFx,
    startCheckoutSessionForSeatSubscriptionFx,
    getCustomerSeatPortalSessionUrlFx,
} from 'src/store';
import { NotificationType } from '../../../store/types';

//custom components
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { RoundCloseIcon } from 'shared-frontend/icons/RoundIcons/RoundCloseIcon';
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { SocialLogin } from '@library/common/SocialLogin/SocialLogin';
import { AppDialogsEnum } from 'src/store/types';
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { Translation } from '@library/common/Translation/Translation';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

//const
import { profileRoute } from '../../../const/client-routes';

//icons
import { StripeIcon } from 'shared-frontend/icons/OtherIcons/StripeIcon';

import { isMobile } from 'shared-utils';

import styles from './PayToAddNewTeamMemberDialog.module.scss';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

export const PayToAddNewTeamMemberDialog = () => {
    const { payToAddNewTeamMemberDialog } = useStore($appDialogsStore);
    const isConnectedStripe = useStore($isConnectedStripe);
    const isConnectStripeAccountPending = useStore(
        connectStripeAccountFx.pending,
    );
    const profile = useStore($profileStore);
    const router = useRouter();
    const seatProducts = useStore($seatProductsStore);

    useEffect(() => {
        if (profile.isStripeEnabled && !profile.wasSuccessNotificationShown) {
            addNotificationEvent({
                type: NotificationType.PaymentSuccess,
                message: 'payments.connectAccountSuccess',
                withSuccessIcon: true,
            });
            updateProfileFx({
                wasSuccessNotificationShown: true,
            });
        }
    }, [profile.isStripeEnabled, profile.wasSuccessNotificationShown]);

    const close = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.payToAddNewTeamMemberDialog,
        });
    }, []);

    const handleSetUpPayments = useCallback(async () => {
        if (!isConnectStripeAccountPending) {
            await connectStripeAccountFx();
        }
    }, [isConnectStripeAccountPending]);

    const handleChooseSubscription = async () => {
        if (seatProducts.length && !profile.stripeSeatSubscriptionId) {
            const response = await startCheckoutSessionForSeatSubscriptionFx({
                productId: seatProducts[0].product.id,
                baseUrl: profileRoute,
            });

            if (response?.url) {
                return router.push(response.url);
            }
        } else if (profile.stripeSeatSubscriptionId) {
            const response = await getCustomerSeatPortalSessionUrlFx({
                subscriptionId: profile.stripeSeatSubscriptionId,
            });

            if (response?.url) {
                return router.push(response.url);
            }
        }
    };

    return (
        <>
            <CustomDialog
                open={payToAddNewTeamMemberDialog && !isMobile()}
                className={styles.content}
            >
                <CustomGrid container flexDirection="column" className={styles.main} gap={2}>
                    <CustomGrid className={styles.buttonClose}>
                        <RoundCloseIcon
                            width="28px"
                            height="28px"
                            onClick={close}
                        />
                    </CustomGrid>
                    <CustomGrid className={styles.header}>
                        <CustomTypography
                            nameSpace="profile"
                            className={styles.headerText}
                            translation="seatsTeamMembers.payToAddNewTeamMemberDialog.header"
                        />
                    </CustomGrid>
                    <CustomGrid container justifyContent="center">
                        <CustomImage
                            width={40}
                            height={40}
                            src={'/images/hi-hand.webp'}
                            alt="gategory-item"
                        />
                    </CustomGrid>
                    <CustomGrid container justifyContent="center" gap={2}>
                        <ConditionalRender condition={!isConnectedStripe}>
                            <CustomTypography
                                variant="body2"
                                nameSpace="profile"
                                translation="seatsTeamMembers.payToAddNewTeamMemberDialog.stripeConenctionError"
                            />
                            <SocialLogin
                                Icon={StripeIcon}
                                onClick={handleSetUpPayments}
                            >
                                {!isConnectStripeAccountPending ? (
                                    <>
                                        &nbsp;
                                        <CustomTypography
                                            nameSpace="profile"
                                            translation={
                                                !profile.isStripeEnabled &&
                                                    profile.stripeAccountId
                                                    ? 'monetization.setUp'
                                                    : 'monetization.connectWith'
                                            }
                                        />
                                        &nbsp;
                                        <CustomTypography
                                            variant="body1bold"
                                            nameSpace="profile"
                                            translation="monetization.stripe"
                                        />
                                    </>
                                ) : (
                                    <CustomLoader />
                                )}
                            </SocialLogin>
                        </ConditionalRender>
                        <ConditionalRender condition={isConnectedStripe}>
                            <CustomButton
                                onClick={handleChooseSubscription}
                                label={
                                    <Translation
                                        nameSpace="profile"
                                        translation="seatsTeamMembers.payToAddNewTeamMemberDialog.pay"
                                    />
                                }
                            />
                        </ConditionalRender>
                    </CustomGrid>
                </CustomGrid>
            </CustomDialog>
        </>
    );
};
