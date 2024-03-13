import React, { memo, useCallback, useEffect, useState } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { $isPortraitLayout } from 'src/store';
import { isMobile } from 'shared-utils';
import clsx from 'clsx';

import styles from './MeetingEditRuumeSetting.module.scss';
import { MeetingChat } from '../MeetingChat/MeetingChat';
import { Tab, Tabs, Typography } from '@mui/material';
import { $activeTabPanel, $isAudience, $isHaveNewMessage, $isHaveNewQuestion, $isMeetingHostStore, $meetingUsersStore, resetHaveNewMessageEvent, resetHaveNewQuestionEvent, setActiveTabPanelEvent } from 'src/store/roomStores';
import { MeetingAccessStatusEnum, MeetingRole } from 'shared-types';
import { MeetingUsersList } from '../MeetingUsersList/MeetingUsersList';
import { MeetingAccessRequests } from '../MeetingAccessRequests/MeetingAccessRequests';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { MeetingAudiences } from '../MeetingAudiences/MeetingAudiences';
import { MeetingQuestionAnswer } from '../MeetingQuestionAnswer/MeetingQuestionAnswer';
import { MeetingTranscribe } from '../MeetingChat/MeetingTranscribe';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { EditTemplatePersonalInfo } from '@components/Meeting/EditTemplatePersonalInfo/EditTemplatePersonalInfo';
import { CustomAccordion } from 'shared-frontend/library/custom/CustomAccordion';
import { Translation } from '@library/common/Translation/Translation';
import { Socials } from '@components/Socials/Socials';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { EditMeetingLink } from '@components/Meeting/EditMeetingLink/EditMeetingLink';
import { MeetingMonetization } from '../MeetingMonetization/MeetingMonetization';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';

//icons
import { PersonIcon } from 'shared-frontend/icons/OtherIcons/PersonIcon';
import { CustomLinkIcon } from 'shared-frontend/icons/OtherIcons/CustomLinkIcon';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

//hooks
import { useFormContext } from 'react-hook-form';

export const MeetingEditRuumeSetting = () => {
    const [currentAccordionId, setCurrentAccordionId] = useState('');

    const {
        formState: { errors },
    } = useFormContext();

    useEffect(() => {
        if (errors) {
            if (errors.fullName) {
                if (currentAccordionId !== 'personal') {
                    handleChangeAccordion('personal');
                }
                return;
            }
            if (errors.companyName && currentAccordionId !== 'company') {
                handleChangeAccordion('company');
            }
        }
    }, [errors]);

    const handleChangeAccordion = useCallback((accordionId: any) => {
        setCurrentAccordionId(prev =>
            prev === accordionId ? '' : accordionId,
        );
    }, []);

    return (
        <CustomGrid
            container
            direction="column"
            className={styles.wrapper}
            gap={3}
        >
            <CustomTypography
                nameSpace="meeting"
                translation="editRuumePanel.title"
                color="white"
                fontSize="20px"
            />
            <CustomScroll>
                <CustomGrid
                    container
                    direction="column"
                    className={styles.wrapper}
                    gap={3}
                >
                    <EditMeetingLink />
                    <CustomAccordion
                        currentAccordionId={currentAccordionId}
                        accordionId="monetization"
                        onChange={handleChangeAccordion}
                        label={
                            <Translation
                                nameSpace="meeting"
                                translation="templates.monetization"
                            />
                        }
                    >
                        <MeetingMonetization />
                    </CustomAccordion>
                    <CustomAccordion
                        currentAccordionId={currentAccordionId}
                        accordionId="videoAudioSettings"
                        onChange={handleChangeAccordion}
                        label={
                            <Translation
                                nameSpace="meeting"
                                translation="templates.videoAudioSettings"
                            />
                        }
                    >
                        {/* <EditTemplatePersonalInfo /> */}
                    </CustomAccordion>
                    <CustomAccordion
                        currentAccordionId={currentAccordionId}
                        accordionId="updateAvatar"
                        onChange={handleChangeAccordion}
                        label={
                            <Translation
                                nameSpace="meeting"
                                translation="templates.updateAvatar"
                            />
                        }
                    >
                        {/* <EditTemplatePersonalInfo /> */}
                    </CustomAccordion>
                    <CustomButton
                        className={styles.doNotDisturbBtn}
                    >
                        <CustomGrid
                            container
                            justifyContent="space-between"
                            alignItems="center"
                            fontSize="18px"
                        >
                            <Translation
                                nameSpace="meeting"
                                translation="templates.doNotDisturb.title"
                            />
                            <Translation
                                nameSpace="meeting"
                                translation="templates.doNotDisturb.on"
                            />
                            <FiberManualRecordIcon sx={{ color: 'red' }} />
                        </CustomGrid>
                    </CustomButton>
                </CustomGrid>

            </CustomScroll>

            <CustomGrid
                item
                container
                justifyContent="center"
            >
                <CustomButton
                    className={styles.saveBtn}
                    type="submit"
                    label={
                        <Translation
                            nameSpace="meeting"
                            translation="profileSettingPanel.saveBtn"
                        />
                    }
                />
            </CustomGrid>
        </CustomGrid>
    );
};
