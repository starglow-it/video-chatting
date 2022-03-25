import React, {memo, useCallback, useMemo} from 'react';
import {useStore, useStoreMap} from "effector-react";
import {useRouter} from "next/router";

// image
import Image from 'next/image';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from "@library/custom/CustomTypography/CustomTypography";
import { CustomBox } from "@library/custom/CustomBox/CustomBox";

// components
import {ProfileAvatar} from "@components/Profile/ProfileAvatar/ProfileAvatar";
import {ArrowLeftIcon} from "@library/icons/ArrowLeftIcon";

// stores
import { $meetingTemplateStore } from "../../../store/meeting";
import {$localUserStore, $meetingUsersStore} from "../../../store/users";

// styles
import styles from './MeetingPreview.module.scss';

const MeetingPreview = memo(() => {
    const router = useRouter();
    const meetingTemplate = useStore($meetingTemplateStore);
    const localUser = useStore($localUserStore);

    const users = useStoreMap({
        store: $meetingUsersStore,
        keys: [localUser.id],
        fn: (state, [localUserId]) => state.filter(user => user.id !== localUserId),
    });

    const handleLeaveMeeting = useCallback(() => {
        const isOwner = meetingTemplate.meetingInstance?.owner === localUser.profileId;

        router.push(isOwner ? '/dashboard/templates' : '/dashboard/discovery');
    }, [meetingTemplate.meetingInstance?.owner, localUser.profileId]);

    const renderCurrentUsers = useMemo(() => {
        return users.map(user => (
            <ProfileAvatar
                key={user.id}
                className={styles.userAvatar}
                width="32px"
                height="32px"
                src={user?.profileAvatar}
                userName={user.username}
            />
        ), []);
    }, [users]);

    return (
        <CustomGrid container alignItems="center" className={styles.meetingPreviewWrapper} wrap="nowrap">
            <CustomGrid container justifyContent="center" alignItems="center" onClick={handleLeaveMeeting} className={styles.backButton}>
                <ArrowLeftIcon width="32px" height="32px" />
            </CustomGrid>
            <CustomBox className={styles.imageWrapper}>
                <Image src={meetingTemplate.previewUrl} layout="fill" objectFit="cover" objectPosition="center" />
            </CustomBox>
            <ProfileAvatar
                className={styles.profileAvatar}
                width="90px"
                height="90px"
                src={meetingTemplate?.user?.profileAvatar?.url}
                userName={meetingTemplate.fullName}
            />
            <CustomGrid item container direction="column" flex="1 0">
                <CustomTypography variant="h3bold" color="colors.white.primary">
                    {meetingTemplate.companyName}
                </CustomTypography>
                <CustomTypography variant="body1" color="colors.white.primary">
                    {meetingTemplate.description}
                </CustomTypography>
            </CustomGrid>
            <CustomGrid container alignSelf="flex-start" justifyContent="flex-end" className={styles.inMeetingAvatars} flex="1 0">
                {renderCurrentUsers}
            </CustomGrid>
        </CustomGrid>
    );
});

export { MeetingPreview };