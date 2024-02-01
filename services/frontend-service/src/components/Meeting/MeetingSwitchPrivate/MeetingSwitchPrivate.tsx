import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import { Translation } from '@library/common/Translation/Translation';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomSwitch } from '@library/custom/CustomSwitch/CustomSwitch';
import {
    $meetingTemplateStore,
    updateMeetingTemplateFxWithData,
} from 'src/store/roomStores';
import { useStore } from 'effector-react';
import styles from './MeetingSwitchPrivate.module.scss';

export const MeetingSwitchPrivate = () => {
    const { isAcceptNoLogin, subdomain, isPublishAudience } = useStore(
        $meetingTemplateStore,
    );

    const onChangeSwitch = () => {
        updateMeetingTemplateFxWithData({
            isPublishAudience: !isPublishAudience,
        });
    };

    return (
        <CustomTooltip
            placement="top"
            title={
                isAcceptNoLogin || subdomain ? (
                    <Translation
                        nameSpace="meeting"
                        translation="disablePublicMeeting"
                    />
                ) : (
                    ''
                )
            }
            popperClassName={styles.popperTooltip}
            tooltipClassName={styles.containerTooltip}
        >
            <CustomGrid
                id="privatePublicSetting"
                display="flex"
                justifyContent="center"
                gap={1}
                margin="20px"
            >
                <CustomGrid
                    gap={1}
                    display="flex"
                    justifyContent="center"
                    className={
                        isAcceptNoLogin || subdomain
                            ? styles.disablePublic
                            : undefined
                    }
                >
                    {isPublishAudience ? (
                        <span>Public</span>
                    ) : (
                        <span>Private</span>
                    )}
                    <CustomSwitch
                        onChange={onChangeSwitch}
                        checked={isPublishAudience}
                    />
                </CustomGrid>
            </CustomGrid>
        </CustomTooltip>
    );
};
