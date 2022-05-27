import React, {memo, useCallback, useMemo} from "react";
import {useFormContext, useWatch} from "react-hook-form";
import {InputAdornment} from "@mui/material";
import Image from 'next/image';

// custom
import { CustomGrid } from "@library/custom/CustomGrid/CustomGrid";
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { CustomTypography } from "@library/custom/CustomTypography/CustomTypography";

// icons
import {PlusAddIcon} from "@library/icons/PlusAddIcon";
import {RoundCloseIcon} from "@library/icons/RoundCloseIcon";

// types
import {PropsWithClassName} from "../../../types";

// styles
import styles from "./ScheduleMeetingDialog.module.scss";

type Props = {
    userEmails: string[];
    onAddUserEmail: (email: string) => void;
    onDeleteUserEmail: (email: string) => void;
}

const Component = ({ userEmails = [], className, onAddUserEmail, onDeleteUserEmail }: PropsWithClassName<Props>) => {
    const { register, control, setValue, trigger, formState: { errors } } = useFormContext();

    const currentUserEmail = useWatch({
        control,
        name: 'currentUserEmail'
    });

    const handleAddUserEmail = useCallback(async () => {
        const isThereNoErrors = await trigger('currentUserEmail');

        if (isThereNoErrors && currentUserEmail)  {
            onAddUserEmail?.(currentUserEmail);
            setValue('currentUserEmail', '');
        }
    },[currentUserEmail]);

    const handleEnterPress = useCallback((event) => {
        if (event.key === 'Enter') {
            handleAddUserEmail();
        }
    },[currentUserEmail]);

    const renderUserEmails = useMemo(() => userEmails.map(email => {
            const handleDeleteEmail = () => {
                onDeleteUserEmail?.(email);
            }

            return (
                <CustomGrid container alignItems="center" gap={1} wrap="nowrap" className={styles.emailItem}>
                    <CustomTypography variant="body2" className={styles.email}>
                        {email}
                    </CustomTypography>
                    <RoundCloseIcon width="28px" height="28px" className={styles.deleteIcon} onClick={handleDeleteEmail} />
                </CustomGrid>
            )
        }), [userEmails]);

    return (
        <CustomGrid container className={className} gap={1}>
            <CustomInput
                nameSpace="forms"
                translation="addUserEmail"
                {...register("currentUserEmail")}
                error={errors?.currentUserEmail?.[0].message}
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
            <CustomGrid container flex="1 1 auto" className={styles.scrollWrapper} direction="column" alignItems={userEmails?.length ? "flex-start" : "center"} justifyContent="center">
                {userEmails?.length
                    ? (
                        <CustomScroll className={styles.scroll}>
                            <CustomGrid container direction="column" gap={1}>
                                {renderUserEmails}
                            </CustomGrid>
                        </CustomScroll>
                    )
                    : (
                        <>
                            <Image src="/images/sad-face.png" width="40px" height="40px" />
                            <CustomTypography nameSpace="templates" translation="scheduleMeeting.noEmails" />
                        </>
                    )
                }
            </CustomGrid>
        </CustomGrid>
    );
};

export const ScheduleAttendees = memo(Component);