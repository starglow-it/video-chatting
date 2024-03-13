import React, { memo, useCallback, useEffect, useState } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { $isPortraitLayout } from 'src/store';
import { isMobile } from 'shared-utils';
import clsx from 'clsx';

import styles from './MeetingProfileSetting.module.scss';
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

//icons
import { PersonIcon } from 'shared-frontend/icons/OtherIcons/PersonIcon';
import { CustomLinkIcon } from 'shared-frontend/icons/OtherIcons/CustomLinkIcon';

//hooks
import { useFormContext } from 'react-hook-form';

export const MeetingProfileSetting = () => {
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
                translation="profileSettingPanel.title"
                color="white"
                fontSize="20px"
            />
            <CustomAccordion
                AccordionIcon={
                    <PersonIcon width="24px" height="24px" />
                }
                currentAccordionId={currentAccordionId}
                accordionId="personal"
                onChange={handleChangeAccordion}
                label={
                    <Translation
                        nameSpace="meeting"
                        translation="templates.personal"
                    />
                }
            >
                <EditTemplatePersonalInfo />
            </CustomAccordion>
            <CustomAccordion
                AccordionIcon={
                    <CustomLinkIcon width="24px" height="24px" />
                }
                currentAccordionId={currentAccordionId}
                accordionId="links"
                onChange={handleChangeAccordion}
                label={
                    <Translation
                        nameSpace="meeting"
                        translation="templates.links"
                    />
                }
            >
                <Socials buttonClassName={styles.socialBtn} />
            </CustomAccordion>
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
