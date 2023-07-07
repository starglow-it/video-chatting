import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { useStore } from 'effector-react';
import { ClickAwayListener } from '@mui/material';

// hooks
import { useToggle } from '@hooks/useToggle';

// library
import { EditRoundIcon } from 'shared-frontend/icons/OtherIcons/EditRoundIcon';
import { UploadRoundIcon } from 'shared-frontend/icons/OtherIcons/UploadRoundIcon';
import { HiddenPaper } from 'shared-frontend/library/common/HiddenPaper';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

// components
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import { ChooseFile } from '@components/ChooseFile/ChooseFile';

// custom
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomList } from '@library/custom/CustomList/CustomList';
import { getFileSizeValue } from '../../../utils/functions/getFileSizeValue';

// stores
import {
    $profileStore,
    deleteProfilePhotoFx,
    updateProfilePhotoFx,
} from '../../../store';

// styles
import styles from './EditProfileAvatar.module.scss';

// types
import { EditProfileAvatarProps } from './types';
import { FileSizeTypesEnum } from '../../../types/fileSize';

// const
import { ACCEPT_MIMES } from '../../../const/profile/profilePhoto';

const EditProfileAvatar = memo(({ className }: EditProfileAvatarProps) => {
    const profile = useStore($profileStore);

    const {
        value: isEditProfileAvatarOpen,
        onToggleSwitch: onToggleEditProfileAvatarMenu,
        onSwitchOff: onCloseEditProfileAvatarMenu,
    } = useToggle(false);

    const {
        value: fileSizeError,
        onSwitchOn: onShowFileSizeError,
        onSwitchOff: onHideFileSizeError,
    } = useToggle(false);

    const {
        value: fileTypeError,
        onSwitchOn: onShowFileTypeError,
        onSwitchOff: onHideFileTypeError,
    } = useToggle(false);

    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        if (fileTypeError) {
            timerRef.current = setTimeout(() => {
                onHideFileTypeError();
            }, 6000);
        }
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [fileTypeError]);

    const handleUploadFiles = useCallback(async file => {
        const twoMb = getFileSizeValue({
            amount: 2,
            sizeType: FileSizeTypesEnum.megabyte,
        });

        const isFileTypeCorrect = ACCEPT_MIMES.includes(file.type);

        if (!isFileTypeCorrect) {
            onShowFileTypeError();
        } else if (file.size > twoMb) {
            onShowFileSizeError();
        } else {
            onHideFileTypeError();
            onHideFileSizeError();
            await updateProfilePhotoFx({ file });
        }
        onCloseEditProfileAvatarMenu();
    }, []);

    const handleDeleteProfilePhoto = useCallback(async () => {
        await deleteProfilePhotoFx();
        onCloseEditProfileAvatarMenu();
    }, []);

    const listElements = useMemo(
        () => [
            {
                key: profile?.profileAvatar?.url
                    ? 'editAvatar'
                    : 'uploadAvatar',
                element: (
                    <CustomGrid container className={styles.listItem}>
                        <ChooseFile
                            onChoose={handleUploadFiles}
                            accept={ACCEPT_MIMES}
                        >
                            <CustomTypography
                                nameSpace="profile"
                                translation={
                                    profile?.profileAvatar?.url
                                        ? 'avatar.edit'
                                        : 'avatar.upload'
                                }
                            />
                        </ChooseFile>
                    </CustomGrid>
                ),
            },
            {
                key: 'deleteAvatar',
                element: (
                    <CustomGrid
                        container
                        className={styles.listItem}
                        onClick={handleDeleteProfilePhoto}
                    >
                        <CustomTypography
                            nameSpace="profile"
                            translation="avatar.delete"
                        />
                    </CustomGrid>
                ),
            },
        ],
        [profile?.profileAvatar?.url],
    );

    const commonAvatarLayout = useMemo(
        () => (
            <>
                <ProfileAvatar
                    src={profile?.profileAvatar?.url}
                    width="90px"
                    height="90px"
                    userName={profile.fullName}
                    withoutShadow
                />

                <CustomGrid
                    container
                    justifyContent="center"
                    alignItems="center"
                    className={clsx(className, styles.editProfileAvatar, {
                        [styles.upload]: !profile?.profileAvatar?.url,
                    })}
                >
                    {profile?.profileAvatar?.url ? (
                        <EditRoundIcon width="28px" height="28px" />
                    ) : (
                        <UploadRoundIcon width="28px" height="28px" />
                    )}
                </CustomGrid>
            </>
        ),
        [profile?.profileAvatar?.url],
    );

    return (
        <CustomGrid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap={1}
            className={styles.avatarWrapper}
        >
            <ClickAwayListener onClickAway={onCloseEditProfileAvatarMenu}>
                <CustomBox className={styles.profileAvatar}>
                    {profile?.profileAvatar?.url ? (
                        <CustomBox
                            className={styles.uploadAvatar}
                            onClick={onToggleEditProfileAvatarMenu}
                        >
                            {commonAvatarLayout}
                        </CustomBox>
                    ) : (
                        <ChooseFile
                            onChoose={handleUploadFiles}
                            accept={ACCEPT_MIMES}
                        >
                            {commonAvatarLayout}
                        </ChooseFile>
                    )}
                    <HiddenPaper
                        className={styles.invalidTypeWrapper}
                        open={fileTypeError}
                    >
                        <CustomTypography
                            textAlign="center"
                            variant="body3"
                            color="colors.red.primary"
                            nameSpace="profile"
                            translation="upload.profileAvatar.invalidFileType"
                        />
                    </HiddenPaper>
                    <HiddenPaper
                        className={styles.editProfileAvatarMenu}
                        open={isEditProfileAvatarOpen}
                    >
                        <CustomList listElements={listElements} />
                    </HiddenPaper>
                </CustomBox>
            </ClickAwayListener>
            <CustomTypography
                variant="body3"
                className={styles.uploadSizeHint}
                color={`colors.${
                    fileSizeError ? 'red.primary' : 'grayscale.normal'
                }`}
                nameSpace="profile"
                translation="upload.profileAvatar.maxSize"
            />
        </CustomGrid>
    );
});

export { EditProfileAvatar };
