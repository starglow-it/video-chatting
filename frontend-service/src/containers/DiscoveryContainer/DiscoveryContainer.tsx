import React, { memo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useStore } from 'effector-react';

// custom
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// components
import { TemplatePreviewDialog } from '@components/Dialogs/TemplatePreviewDialog/TemplatePreviewDialog';
import { TemplatesGrid } from '@components/Templates/TemplatesGrid/TemplatesGrid';
import { MainProfileWrapper } from '@library/common/MainProfileWrapper/MainProfileWrapper';
import { DiscoverTemplateItem } from '@components/Templates/DiscoverTemplateItem/DiscoverTemplateItem';

// stores
import {
    $discoveryTemplatesStore,
    getUsersTemplatesFx,
    setScheduleTemplateIdEvent,
} from '../../store';
import { appDialogsApi } from '../../store';

// styles
import styles from './DiscoveryContainer.module.scss';

// types
import { AppDialogsEnum } from '../../store/types';
import { getClientMeetingUrl } from '../../utils/urls';

const DiscoveryContainer = memo(() => {
    const router = useRouter();

    const templates = useStore($discoveryTemplatesStore);

    useEffect(() => {
        (async () => {
            await getUsersTemplatesFx({ limit: 6, skip: 0 });
        })();
    }, []);

    const handleEnterWaitingRoom = useCallback(({ templateId }) => {
        router.push(getClientMeetingUrl(templateId));
    }, []);

    const handleUserTemplatesPageChange = useCallback(async newPage => {
        await getUsersTemplatesFx({ limit: 6 * newPage, skip: 0 });
    }, []);

    const handleScheduleMeeting = useCallback(({ templateId }) => {
        setScheduleTemplateIdEvent(templateId);

        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.scheduleMeetingDialog,
        });
    }, []);

    return (
        <MainProfileWrapper>
            <CustomGrid container direction="column" alignItems="center">
                <CustomGrid
                    className={styles.usersTemplates}
                    container
                    alignItems="center"
                    justifyContent="center"
                >
                    <CustomBox className={styles.image}>
                        <Image
                            src="/images/blush-face.png"
                            width="40px"
                            height="40px"
                            alt="blush-face"
                        />
                    </CustomBox>
                    <CustomTypography
                        variant="h1"
                        nameSpace="profile"
                        translation="pages.discovery"
                    />
                </CustomGrid>
                <TemplatesGrid
                    list={templates.list}
                    count={templates.count}
                    onPageChange={handleUserTemplatesPageChange}
                    TemplateComponent={DiscoverTemplateItem}
                />
            </CustomGrid>
            <TemplatePreviewDialog
                isNeedToRenderTemplateInfo={false}
                onSchedule={handleScheduleMeeting}
                chooseButtonKey="joinMeeting"
                onChooseTemplate={handleEnterWaitingRoom}
            />
        </MainProfileWrapper>
    );
});

export { DiscoveryContainer };
