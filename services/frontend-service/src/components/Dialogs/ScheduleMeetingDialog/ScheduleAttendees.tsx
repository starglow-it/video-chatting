import React, { memo, useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { InputAdornment } from '@mui/material';
import clsx from 'clsx';

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import { ErrorMessage } from '@library/common/ErrorMessage/ErrorMessage';

// icons
import { PlusAddIcon } from 'shared-frontend/icons/OtherIcons/PlusAddIcon';
import { RoundCloseIcon } from 'shared-frontend/icons/RoundIcons/RoundCloseIcon';

// types
import { PropsWithClassName } from 'shared-frontend/types';

// shared
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { CustomInput } from 'shared-frontend/library/custom/CustomInput';

// styles
import styles from './ScheduleMeetingDialog.module.scss';

type Props = {
    userEmails: string[];
    onAddUserEmail: (email: string) => void;
    onDeleteUserEmail: (email: string) => void;
};

const Component = ({
    userEmails = [],
    className,
    onAddUserEmail,
    onDeleteUserEmail,
}: PropsWithClassName<Props>) => {
    const {
        register,
        control,
        setValue,
        trigger,
        formState: { errors },
    } = useFormContext();

    const currentUserEmail = useWatch({
        control,
        name: 'currentUserEmail',
    });

    const { isMobile } = useBrowserDetect();

    const handleAddUserEmail = useCallback(async () => {
        const isThereNoErrors = await trigger('currentUserEmail');

        if (isThereNoErrors && currentUserEmail) {
            onAddUserEmail?.(currentUserEmail);
            setValue('currentUserEmail', '');
        }
    }, [currentUserEmail]);

    const handleEnterPress = useCallback(
        async (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                await handleAddUserEmail();
            }
        },
        [currentUserEmail],
    );

    const renderUserEmails = useMemo(
        () =>
            userEmails.map(email => {
                const handleDeleteEmail = () => {
                    onDeleteUserEmail?.(email);
                };

                return (
                    <CustomGrid
                        container
                        alignItems="center"
                        gap={1}
                        wrap="nowrap"
                        className={styles.emailItem}
                        key={email}
                    >
                        <CustomTypography
                            variant="body2"
                            className={styles.email}
                        >
                            {email}
                        </CustomTypography>
                        <RoundCloseIcon
                            width="28px"
                            height="28px"
                            className={styles.deleteIcon}
                            onClick={handleDeleteEmail}
                        />
                    </CustomGrid>
                );
            }),
        [userEmails],
    );

    return (
        <CustomGrid container className={className} gap={1}>
            <CustomGrid container direction="column">
                <CustomInput
                    {...register('currentUserEmail')}
                    error={errors?.currentUserEmail?.message?.toString()}
                    onKeyPress={handleEnterPress}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <PlusAddIcon
                                    width="24px"
                                    height="24px"
                                    className={styles.addIcon}
                                    onClick={handleAddUserEmail}
                                />
                            </InputAdornment>
                        ),
                    }}
                />
                <ErrorMessage
                    error={errors?.currentUserEmail?.message?.toString() ?? ''}
                    className={styles.error}
                />
            </CustomGrid>
            <CustomGrid
                container
                flex="1 1 auto"
                className={clsx(styles.scrollWrapper, {
                    [styles.mobile]: isMobile,
                })}
                direction="column"
                alignItems={userEmails?.length ? 'flex-start' : 'center'}
                justifyContent="center"
            >
                {userEmails?.length ? (
                    <CustomScroll className={styles.scroll}>
                        <CustomGrid container direction="column" gap={1}>
                            {renderUserEmails}
                        </CustomGrid>
                    </CustomScroll>
                ) : (
                    <>
                        <CustomImage
                            src="/images/sad-face.webp"
                            width="40px"
                            height="40px"
                        />
                        <CustomTypography
                            nameSpace="templates"
                            translation="scheduleMeeting.noEmails"
                        />
                    </>
                )}
            </CustomGrid>
        </CustomGrid>
    );
};

export const ScheduleAttendees = memo(Component);
