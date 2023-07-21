import { memo, useCallback, useMemo } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

// components
import { ActionButton } from 'shared-frontend/library/common/ActionButton';

// custom
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// icons
import { EditIcon } from 'shared-frontend/icons/OtherIcons/EditIcon';

// stores
import { $profileStore } from '../../store';

// styles
import styles from './SocialLinks.module.scss';

// const
import { SOCIALS_ICONS } from '../../const/profile/socials';
import { editProfileRoute } from '../../const/client-routes';

const SocialLinks = memo(() => {
    const router = useRouter();
    const profileState = useStore($profileStore);

    const handleEditProfile = useCallback(() => {
        router?.push(editProfileRoute);
    }, []);

    const socialsLink = useMemo(
        () =>
            profileState?.socials?.map(social => {
                const Icon = SOCIALS_ICONS[social.key];

                const handleAction = () => {
                    if (social.value) {
                        window.open(social.value, '_blank');
                    }
                };

                return (
                    <CustomTooltip
                        key={social.key}
                        nameSpace="common"
                        translation={`tooltips.${social.key}`}
                    >
                        <ActionButton
                            className={styles.socialBtn}
                            Icon={<Icon width="24px" height="24px" />}
                            onAction={handleAction}
                        />
                    </CustomTooltip>
                );
            }),
        [profileState.socials],
    );

    return (
        <CustomGrid container gap={1} className={styles.socialsWrapper}>
            {socialsLink}
            <CustomTooltip
                nameSpace="common"
                translation="tooltips.editProfile"
            >
                <ActionButton
                    className={styles.editIcon}
                    onAction={handleEditProfile}
                    Icon={<EditIcon width="24" height="24" />}
                />
            </CustomTooltip>
        </CustomGrid>
    );
});

export { SocialLinks };
