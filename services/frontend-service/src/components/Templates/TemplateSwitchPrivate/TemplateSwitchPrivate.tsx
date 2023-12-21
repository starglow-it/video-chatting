import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomSwitch } from '@library/custom/CustomSwitch/CustomSwitch';
import { useStore } from 'effector-react';
import { $scheduleTemplateStore, setScheduleTemplateEvent } from 'src/store';
import { sendUpdateMeetingTemplateEvent } from 'src/store/roomStores';

export const TemplateSwitchPrivate = () => {
    const { isPublishAudience } = useStore($scheduleTemplateStore);

    const onChangeSwitch = () => {
        setScheduleTemplateEvent({ isPublishAudience: !isPublishAudience });
        sendUpdateMeetingTemplateEvent({
            isPublishAudience: !isPublishAudience,
        });
    };

    return (
        <CustomGrid
            display="flex"
            justifyContent="center"
            gap={1}
            margin="20px"
        >
            <CustomGrid gap={1} display="flex" justifyContent="center">
                {isPublishAudience ? <span>Public</span> : <span>Private</span>}
                <CustomSwitch
                    onChange={onChangeSwitch}
                    checked={isPublishAudience}
                />
            </CustomGrid>
        </CustomGrid>
    );
};
