import React, { memo, useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';
import { Fade } from '@mui/material';
import { useStore } from 'effector-react';

// hooks
import { useFileReader } from '@hooks/useFileReader';

// custom
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// icons
import { ImagePlaceholderIcon } from 'shared-frontend/icons/OtherIcons/ImagePlaceholderIcon';
import { UploadArrowIcon } from 'shared-frontend/icons/OtherIcons/UploadArrow';
import { RoundCloseIcon } from 'shared-frontend/icons/RoundIcons/RoundCloseIcon';

// helpers
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { getFileSizeValue } from '../../../utils/functions/getFileSizeValue';

// const
import { ACCEPT_MIMES, ACCEPT_MIMES_NAMES } from '../../../const/profile/profilePhoto';

// types
import { FileSizeTypesEnum } from '../../../types/fileSize';

// shared

// styles
import styles from './SetUpTemplateInfo.module.scss';

// stores
import {
    $profileAvatarImage,
    setProfileAvatarEvent,
    resetProfileAvatarEvent,
} from '../../../store';

const SetUpProfileAvatar = memo(() => {
    const profileAvatar = useStore($profileAvatarImage);
    const [uploadError, setUploadError] = useState<boolean>(false);

    const { onFileAvailable } = useFileReader();

    const handleSetFileData = useCallback(async acceptedFiles => {
        const file = acceptedFiles[0];

        if (!file) return setUploadError(true);

        setUploadError(false);

        const dataUrl = await onFileAvailable(file);

        setProfileAvatarEvent({
            file,
            dataUrl,
        });
    }, []);

    const handleResetProfileAvatar = useCallback(() => {
        resetProfileAvatarEvent();
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        maxFiles: 1,
        maxSize: getFileSizeValue({ sizeType: FileSizeTypesEnum.megabyte, amount: 2 }),
        accept: ACCEPT_MIMES.join(', '),
        onDrop: handleSetFileData,
        noDrag: false,
    });

    const formatNames = useMemo(
        () => `${ACCEPT_MIMES_NAMES.map(format => format.toUpperCase()).join(', ')} up to 2mb`,
        [],
    );

    const inputProps = getInputProps();

    return (
        <CustomGrid container direction="column" gap={1.75}>
            <CustomBox>
                <CustomTypography variant="body1bold">3.</CustomTypography>
                &nbsp;
                <CustomTypography
                    variant="body1bold"
                    nameSpace="forms"
                    translation="labels.profileAvatar"
                />
                {profileAvatar.dataUrl ? (
                    <Fade in>
                        <CustomBox className={styles.image}>
                            <CustomGrid className={styles.preview}>
                                <CustomImage
                                    src={profileAvatar.dataUrl}
                                    width="220px"
                                    height="220px"
                                    objectFit="cover"
                                    className={styles.img}
                                />
                            </CustomGrid>
                            <RoundCloseIcon
                                onClick={handleResetProfileAvatar}
                                className={styles.deleteImage}
                                width="22px"
                                height="22px"
                            />
                        </CustomBox>
                    </Fade>
                ) : (
                    <CustomGrid
                        container
                        className={clsx(styles.dropZone, {
                            [styles.active]: isDragActive,
                            [styles.error]: uploadError,
                        })}
                        {...getRootProps()}
                    >
                        <input {...inputProps} />
                        <CustomGrid
                            className={styles.zoneWrapper}
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                        >
                            {isDragActive ? (
                                <UploadArrowIcon width="40px" height="40px" />
                            ) : (
                                <ImagePlaceholderIcon width="40px" height="40px" />
                            )}
                            <CustomTypography
                                className={styles.uploadTitle}
                                variant="body2"
                                nameSpace="forms"
                                translation="labels.dragAndDrop"
                            />
                            <CustomTypography variant="body3" color="colors.grayscale.normal">
                                {formatNames}
                            </CustomTypography>
                        </CustomGrid>
                    </CustomGrid>
                )}
            </CustomBox>
        </CustomGrid>
    );
});

export { SetUpProfileAvatar };
