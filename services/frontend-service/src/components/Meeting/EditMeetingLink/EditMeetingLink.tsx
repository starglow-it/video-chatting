import { useMemo, useEffect, memo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import InputBase from '@mui/material/InputBase';
import debounce from '@mui/utils/debounce';
import clsx from 'clsx';
import { useStore } from 'effector-react';

// custom
import { CustomLinkIcon } from 'shared-frontend/icons/OtherIcons/CustomLinkIcon';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomIconButton } from '@library/custom/CustomIconButton/CustomIconButton';
import DoneIcon from '@mui/icons-material/Done';

// components
import { ErrorMessage } from '@library/common/ErrorMessage/ErrorMessage';

// store
import { IUserTemplate } from 'shared-types';
import { $meetingTemplateStore } from '../../../store/roomStores';
import { checkCustomLinkFx } from '../../../store';

// styles
import styles from './EditMeetingLink.module.scss';

type UpdateMeetingLink = {
    templateId: IUserTemplate['id'];
    customLink: IUserTemplate['customLink'];
};

const Component = (onSave: () => Promise<void>) => {
    const meetingTemplate = useStore($meetingTemplateStore);

    const {
        control,
        register,
        setError,
        clearErrors,
        formState: { errors },
    } = useFormContext();

    const meetingLink = useWatch({
        control,
        name: 'customLink',
    });

    const handleCheckFreeLinkTail = async (data: UpdateMeetingLink) => {
        const isBusy = await checkCustomLinkFx(data);

        if (isBusy) {
            setError('customLink', {
                type: 'focus',
                message: 'meeting.settings.customLink.busy',
            });
        } else {
            clearErrors('customLink');
        }
    };

    const checkCustomLinkRequest = useMemo(
        () =>
            debounce<(data: UpdateMeetingLink) => Promise<void>>(
                handleCheckFreeLinkTail,
                1000,
            ),
        [],
    );

    useEffect(() => {
        (async () => {
            if (meetingLink && meetingLink !== meetingTemplate.customLink) {
                checkCustomLinkRequest({
                    templateId: meetingTemplate.id,
                    customLink: meetingLink as string,
                });
            }
        })();
    }, [meetingLink, meetingTemplate.customLink]);

    const registerData = register('customLink');

    const meetingLinkStart = `* /room/`;

    const customLinkError = errors.customLink?.message;
 
    return (
        <CustomGrid container direction="column" gap={1}>
            <CustomGrid
                container
                className={clsx(styles.linkWrapper, {
                    [styles.error]: Boolean(customLinkError),
                })}
                alignItems="center"
                justifyContent="space-between"
                gap={1}
                wrap="nowrap"
            >
                <CustomLinkIcon width="24px" height="24px" />
                <InputBase
                    autoComplete="off"
                    placeholder="Your meeting link here*"
                    classes={{
                        root: styles.inputWrapper,
                        input: styles.input,
                    }}
                    {...registerData}
                />
                <CustomIconButton type="submit" size="small"><DoneIcon /></CustomIconButton>
            </CustomGrid>
            <CustomGrid
                container
                wrap="nowrap"
                className={styles.textLinkWrapper}
            >
                <CustomTypography className={styles.linkStart}>
                    {meetingLinkStart}
                </CustomTypography>
                <CustomTypography
                    color="colors.white.primary"
                    nameSpace={meetingLink ? '' : 'meeting'}
                    translation={meetingLink ? '' : 'customLink.yourLink'}
                    className={styles.linkTail}
                >
                    {meetingLink}
                </CustomTypography>
            </CustomGrid>
            <ErrorMessage error={customLinkError?.toString() ?? ''} />
        </CustomGrid>
    );
};

export const EditMeetingLink = memo(Component);
