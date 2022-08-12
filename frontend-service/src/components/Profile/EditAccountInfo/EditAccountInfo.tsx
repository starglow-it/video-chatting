import React, { memo, useMemo } from 'react';
import { useStore } from 'effector-react';

// hooks
import { useToggle } from '@hooks/useToggle';

// custom
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// components
import { EditProfileAvatar } from '@components/Profile/EditProfileAvatar/EditProfileAvatar';
import { EditProfileEmailInfo } from '@components/Profile/EditProfileEmailInfo/EditProfileEmailInfo';
import { EditProfilePasswordInfo } from '@components/Profile/EditProfilePasswordInfo/EditProfilePasswordInfo';

// icons
import { LockIcon } from '@library/icons/LockIcon';

// stores
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
                <CustomGrid container gap={1} className={styles.buttonsWrapper} wrap="nowrap">
                    <CustomButton
                        onClick={handleToggleEditEmail}
                        className={styles.button}
                        variant="custom-cancel"
                        nameSpace="profile"
                        translation="editProfile.changeEmail"
                        typographyProps={{
                            variant: 'body2',
                        }}
                    />
                    <CustomButton
                        onClick={handleStartEditPassword}
                        className={styles.button}
                        variant="custom-cancel"
                        nameSpace="profile"
                        translation="editProfile.changePassword"
                        typographyProps={{
                            variant: 'body2',
                        }}
                    />
                </CustomGrid>
            </>
        ),
        [profile.email],
    );

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
