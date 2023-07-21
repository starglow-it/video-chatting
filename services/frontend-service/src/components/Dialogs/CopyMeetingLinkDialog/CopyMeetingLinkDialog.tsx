import { memo, useCallback } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// custom
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import { CustomLinkIcon } from 'shared-frontend/icons/OtherIcons/CustomLinkIcon';

// shared
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

// stores
import { Translation } from '@library/common/Translation/Translation';
import { $appDialogsStore, appDialogsApi } from '../../../store';

// styles
import styles from './CopyMeetingLinkDialog.module.scss';

// types
import { AppDialogsEnum } from '../../../store/types';

// utils
import { getClientMeetingUrlWithDomain } from '../../../utils/urls';

const Component = () => {
    const router = useRouter();

    const { copyMeetingLinkDialog } = useStore($appDialogsStore);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.copyMeetingLinkDialog,
        });
    }, []);

    const handleOpenEmailInvite = useCallback(() => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.inviteAttendeeByEmailDialog,
        });
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.copyMeetingLinkDialog,
        });
    }, []);

    const meetingLinkText = getClientMeetingUrlWithDomain(
        router.query.token as string,
    );

    return (
        <CustomDialog
            open={copyMeetingLinkDialog}
            contentClassName={styles.wrapper}
            onClose={handleClose}
        >
            <CustomGrid container justifyContent="center">
                <CustomGrid
                    container
                    justifyContent="center"
                    alignItems="center"
                    gap={1}
                >
                    <CustomImage
                        src="/images/winking-face.webp"
                        width="30px"
                        height="30px"
                    />
                    <CustomTypography
                        variant="h4bold"
                        nameSpace="meeting"
                        translation="meetingReady"
                    />
                </CustomGrid>

                <CustomGrid
                    container
                    wrap="nowrap"
                    justifyContent="space-between"
                    className={styles.copyLink}
                >
                    <CustomGrid
                        container
                        className={styles.linkWrapper}
                        wrap="nowrap"
                    >
                        <CustomLinkIcon width="24px" height="24px" />
                        <CustomTypography className={styles.linkText}>
                            {meetingLinkText}
                        </CustomTypography>
                    </CustomGrid>

                    <CopyToClipboard text={meetingLinkText}>
                        <CustomButton
                            variant="custom-cancel"
                            className={styles.copyButton}
                            label={
                                <Translation
                                    nameSpace="common"
                                    translation="buttons.copy"
                                />
                            }
                        />
                    </CopyToClipboard>
                </CustomGrid>

                <CustomButton
                    label={
                        <Translation
                            nameSpace="meeting"
                            translation="invite.inviteButton"
                        />
                    }
                    onClick={handleOpenEmailInvite}
                />
            </CustomGrid>
        </CustomDialog>
    );
};

export const CopyMeetingLinkDialog = memo(Component);
