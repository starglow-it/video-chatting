import { memo, useCallback, useEffect } from 'react';
import { useStore } from 'effector-react';

// custom
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import { TemplatePreviewDialog } from '@components/Dialogs/TemplatePreviewDialog/TemplatePreviewDialog';
import { TemplatesGrid } from '@components/Templates/TemplatesGrid/TemplatesGrid';
import { MainProfileWrapper } from '@components/MainProfileWrapper/MainProfileWrapper';
import { DiscoverTemplateItem } from '@components/Templates/DiscoverTemplateItem/DiscoverTemplateItem';

// stores
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { ICommonTemplate, IUserTemplate } from 'shared-types';
import {
    $discoveryTemplatesStore,
    getUsersTemplatesFx,
    appDialogsApi,
    setScheduleTemplateIdEvent,
} from '../../store';

// shared

// styles
import styles from './DiscoveryContainer.module.scss';

// types
import { AppDialogsEnum } from '../../store/types';
import { getClientMeetingUrl } from '../../utils/urls';

const DiscoveryContainer = memo(() => {
    const templates = useStore($discoveryTemplatesStore);

    useEffect(() => {
        (async () => {
            await getUsersTemplatesFx({ limit: 6, skip: 0 });
        })();
    }, []);

    const handleEnterWaitingRoom = useCallback(
        (templateId: ICommonTemplate['id']) => {
            window.open(getClientMeetingUrl(templateId), '_blank');
        },
        [],
    );

    const handleUserTemplatesPageChange = useCallback(
        async (newPage: number) => {
            await getUsersTemplatesFx({ limit: 6 * newPage, skip: 0 });
        },
        [],
    );

    const handleScheduleMeeting = useCallback(
        ({ templateId }: { templateId: ICommonTemplate['id'] }) => {
            setScheduleTemplateIdEvent(templateId);

            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.scheduleMeetingDialog,
            });
        },
        [],
    );

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
                        <CustomImage
                            src="/images/blush-face.webp"
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
                <TemplatesGrid<IUserTemplate>
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
