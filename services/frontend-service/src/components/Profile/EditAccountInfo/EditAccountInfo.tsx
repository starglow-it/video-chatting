import { memo, useMemo } from 'react';
import { useStore } from 'effector-react';

import {
    LoginTypes,
  } from 'shared-types';

// hooks
import { useToggle } from '@hooks/useToggle';

// custom
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { LockIcon } from 'shared-frontend/icons/OtherIcons/LockIcon';

// components
import { EditProfileAvatar } from '@components/Profile/EditProfileAvatar/EditProfileAvatar';
import { EditProfileEmailInfo } from '@components/Profile/EditProfileEmailInfo/EditProfileEmailInfo';
import { EditProfilePasswordInfo } from '@components/Profile/EditProfilePasswordInfo/EditProfilePasswordInfo';
import { Translation } from '@library/common/Translation/Translation';

// stores
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { $profileStore } from '../../../store';

// styles
import styles from './EditAccountInfo.module.scss';

const EditAccountInfo = memo(() => {
    const profile = useStore($profileStore);

    const {
        value: isEmailEdit,
        onToggleSwitch: handleToggleEditEmail,
        onSwitchOff: handleCloseEditEmail,
    } = useToggle(false);

    const {
        value: isPasswordEdit,
        onToggleSwitch: handleStartEditPassword,
        onSwitchOff: handleCloseEditPassword,
    } = useToggle(false);

    const basicComponentLayout = useMemo(
        () => (
            <>
                <CustomTypography variant="body1">{profile.email}</CustomTypography>
                <ConditionalRender condition={profile.loginType === LoginTypes.Local}>
                    <CustomGrid container gap={1} className={styles.buttonsWrapper} wrap="nowrap">
                        <CustomButton
                            onClick={handleToggleEditEmail}
                            className={styles.button}
                            label={
                                <Translation
                                    nameSpace="profile"
                                    translation="editProfile.changeEmail"
                                />
                            }
                            variant="custom-cancel"
                            typographyProps={{
                                variant: 'body2',
                            }}
                        />
                        <CustomButton
                            label={
                                <Translation
                                    nameSpace="profile"
                                    translation="editProfile.changePassword"
                                />
                            }
                            onClick={handleStartEditPassword}
                            className={styles.button}
                            variant="custom-cancel"
                            typographyProps={{
                                variant: 'body2',
                            }}
                        />
                    </CustomGrid>
                </ConditionalRender>
            </>
        ),
        [profile.email],
    )

    return (
        <CustomPaper className={styles.paperWrapper}>
            <CustomBox
                display="grid"
                gridTemplateColumns="minmax(110px, 192px) 1fr"
                gridTemplateRows="repeat(1, 1fr)"
            >
                <CustomBox gridArea="1/1/1/1">
                    <CustomGrid container alignItems="center">
                        <LockIcon width="24px" height="24px" className={styles.icon} />
                        <CustomTypography
                            variant="body1"
                            fontWeight="600"
                            nameSpace="profile"
                            translation="account"
                        />
                    </CustomGrid>
                </CustomBox>
                <CustomGrid
                    gridArea="1/2/1/2"
                    container
                    wrap="nowrap"
                    alignItems="flex-start"
                    className={styles.contentWrapper}
                >
                    {!(isEmailEdit || isPasswordEdit) && (
                        <EditProfileAvatar className={styles.editProfileAvatar} />
                    )}
                    <CustomGrid container direction="column" gap={1}>
                        {isEmailEdit || isPasswordEdit ? (
                            <>
                                {isEmailEdit && !isPasswordEdit && (
                                    <EditProfileEmailInfo
                                        onChanged={handleCloseEditEmail}
                                        onCancel={handleCloseEditEmail}
                                    />
                                )}
                                {!isEmailEdit && isPasswordEdit && (
                                    <EditProfilePasswordInfo
                                        onChanged={handleCloseEditPassword}
                                        onCancel={handleCloseEditPassword}
                                    />
                                )}
                            </>
                        ) : (
                            basicComponentLayout
                        )}
                    </CustomGrid>
                </CustomGrid>
            </CustomBox>
        </CustomPaper>
    );
});

export { EditAccountInfo };
