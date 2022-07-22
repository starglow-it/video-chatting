import React, {useMemo, useEffect, memo } from 'react';
import {useFormContext, useWatch} from "react-hook-form";
import {InputBase} from "@mui/material";
import debounce from "@mui/utils/debounce";
import clsx from 'clsx';
import {useStore} from "effector-react";

// custom
import {CustomLinkIcon} from "@library/icons/CustomLinkIcon";
import {CustomTypography} from "@library/custom/CustomTypography/CustomTypography";
import {CustomGrid} from "@library/custom/CustomGrid/CustomGrid";

// components
import {ErrorMessage} from "@library/common/ErrorMessage/ErrorMessage";

// store
import {$meetingTemplateStore, checkCustomLinkFxWithData} from "../../../store";

// styles
import styles from './EditMeetingLink.module.scss';

const Component = () => {
    const meetingTemplate = useStore($meetingTemplateStore);

    const { control, register, setError, clearErrors, formState: { errors } } = useFormContext();

    const meetingLink = useWatch({
        control,
        name: "customLink"
    });

    const handleCheckFreeLinkTail = async (data: { templateId: string }) => {
        const isBusy =  await checkCustomLinkFxWithData(data);

        if (isBusy) {
            setError('customLink', [{ type: 'focus', message: 'meeting.settings.customLink.busy' }]);
        } else {
            clearErrors('customLink');
        }
    }

    const checkCustomLinkRequest = useMemo(() =>
        debounce<(data: { templateId: string }) => Promise<void>>(handleCheckFreeLinkTail, 1000)
    , []);

    useEffect(() => {
        (async () => {
            if (meetingLink && meetingLink !== meetingTemplate.customLink) {
                checkCustomLinkRequest({ templateId: meetingLink });
            }
        })();
    }, [meetingLink, meetingTemplate.customLink]);

    const registerData = register('customLink');

    const meetingLinkStart = `* /meeting/`;

    const customLinkError = errors.customLink?.[0]?.message;

    return (
        <CustomGrid container direction="column">
            <CustomGrid container className={clsx(styles.linkWrapper, {[styles.error]: Boolean(customLinkError) })} alignItems="center" gap={1} wrap="nowrap" flex="1 0 auto">
                <CustomLinkIcon width="24px" height="24px" />
                <InputBase
                    autoComplete="off"
                    placeholder="Your meeting link here*"
                    classes={{
                        root: styles.inputWrapper,
                        input: styles.input
                    }}
                    {...registerData}
                />
            </CustomGrid>
            <CustomGrid container wrap="nowrap" className={styles.textLinkWrapper}>
                <CustomTypography
                    className={styles.linkStart}
                >
                    {meetingLinkStart}
                </CustomTypography>
                <CustomTypography
                    color="colors.white.primary"
                    nameSpace={meetingLink ? "" : "meeting"}
                    translation={meetingLink ? "" : "customLink.yourLink"}
                    className={styles.linkTail}
                >
                    {meetingLink}
                </CustomTypography>
            </CustomGrid>
            <ErrorMessage error={customLinkError} />
        </CustomGrid>
    )
}

export const EditMeetingLink = memo(Component);
