import React, { memo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// components
import { MeetingControlPanel } from '@components/Meeting/MeetingControlPanel/MeetingControlPanel';
import { MeetingEndControls } from '@components/Meeting/MeetingEndControls/MeetingEndControls';
import { MeetingSettingsPanel } from '@components/Meeting/MeetingSettingsPanel/MeetingSettingsPanel';
import { MeetingGeneralInfo } from '@components/Meeting/MeetingGeneralInfo/MeetingGeneralInfo';
import { LocalVideoPreview } from '@components/Meeting/LocalVideoPreview/LocalVideoPreview';
import { AudioDeviceSetUpButton } from '@components/Media/DeviceSetUpButtons/AudioDeviceSetUpButton';
import { VideoDeviceSetUpButton } from '@components/Media/DeviceSetUpButtons/VideoDeviceSetUpButton';
import { ScreenSharingButton } from '@components/Meeting/ScreenSharingButton/ScreenSharingButton';

// stores
import {
    $profileTemplateStore,
    getProfileTemplateFx,
    resetProfileTemplateEvent,
    updateProfileTemplateFx,
} from '../../../store/profile';

// styles
import styles from './EditMeetingTemplateView.module.scss';
import { createMeetingFx } from '../../../store/meetings';

const EditMeetingTemplateView = memo(() => {
    const router = useRouter();

    const profileTemplate = useStore($profileTemplateStore);

    useEffect(() => {
        (async () => {
            const templateId = router.query.token as string;

            await getProfileTemplateFx({ templateId });
        })();
        return () => {
            resetProfileTemplateEvent();
        };
    }, []);

    const handleProfileTemplate = useCallback(
        async updateData => {
            if (updateData) {
                await updateProfileTemplateFx(updateData);
            }

            const result = await createMeetingFx({ templateId: profileTemplate.id });

            if (result.meeting) {
                await router.push(`/meeting/${result.meeting.id}`);
            }
        },
        [profileTemplate.id],
    );

    return (
        <CustomGrid className={styles.mainMeetingWrapper}>
            {profileTemplate?.previewUrl && (
                <Image className={styles.image} src={profileTemplate.previewUrl} layout="fill" />
            )}
            {profileTemplate?.id && (
                <MeetingSettingsPanel
                    template={profileTemplate}
                    onTemplateUpdate={handleProfileTemplate}
                >
                    <CustomGrid container gap={1.5} className={styles.devicesWrapper}>
                        <AudioDeviceSetUpButton isMicActive />
                        <VideoDeviceSetUpButton isCamActive />
                        <ScreenSharingButton />
                    </CustomGrid>
                    <MeetingGeneralInfo />
                    <MeetingControlPanel />
                    <LocalVideoPreview />
                    <MeetingEndControls />
                </MeetingSettingsPanel>
            )}
        </CustomGrid>
    );
});

export { EditMeetingTemplateView };
