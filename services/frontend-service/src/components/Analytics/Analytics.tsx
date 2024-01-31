import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import Router, { useRouter } from 'next/router';

// hooks
import { useLocalization } from '@hooks/useTranslation';
import { useNavigation } from '@hooks/useNavigation';

// shared
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { CustomChip } from 'shared-frontend/library/custom/CustomChip';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { Translation } from '@library/common/Translation/Translation';

// icons
import { ArrowLeftIcon } from 'shared-frontend/icons/OtherIcons/ArrowLeftIcon';

// styles
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import styles from './Analytics.module.scss';
import { $profileTemplatesStore, $templatesStore, getProfileTemplatesFx } from 'src/store';
import { useStore } from 'effector-react';
import { CustomDropdown } from '@library/custom/CustomDropdown/CustomDropdown';
import { Fade, MenuItem } from '@mui/material';

enum Tabs {
    TermsOfService = 'termsOfService',
    PrivacyPolicy = 'privacyPolicy',
}

export enum AnalyticsTabsValues {
    Users = 'users',
    Monetization = 'monetization',
    Rooms = 'rooms',
}

const AnalyticsTabs: { value: string; translationKey: string; view: string }[] = [
    {
        value: AnalyticsTabsValues.Users,
        translationKey: 'users',
        view: ''

    },
    {
        value: AnalyticsTabsValues.Monetization,
        translationKey: 'monetization',
        view: ''

    },
    {
        value: AnalyticsTabsValues.Rooms,
        translationKey: 'rooms',
        view: ''

    },
];
const Component = () => {
    const { translation } = useLocalization('static');
    const profileTemplates = useStore($profileTemplatesStore);
    useEffect(() => {
        console.log(profileTemplates);
    }, [profileTemplates])
    const { activeTab, onChange: onChangeTab } = useNavigation({
        tabs: AnalyticsTabs,
    });

    const router = useRouter();

    const handleGoBack = useCallback(() => {
        Router.back();
    }, [router]);
    const [room, setRoom] = useState();
    useEffect(() => {
        if (router.query.section === 'privacy') {
            onChangeTab(Tabs.PrivacyPolicy);
        }
    }, [router.query]);

    useEffect(() => {
        const handleProfileTemplatesPageChange = async () => {
            await getProfileTemplatesFx({
                limit: 100,
                skip: 0,
            });
        };
        handleProfileTemplatesPageChange();
    }, []);

    const renderRooms = useMemo(
        () =>
            profileTemplates.list.map(room => (
                <MenuItem key={room.id} value={room.id}>
                    {room.name}
                </MenuItem>
            )),
        [],
    );

    const handleChangeRoom = useCallback(({ target: { value } }) => {
        setRoom(value);
    }, []);

    return (
        <CustomGrid
            container
            direction="column"
            alignItems="center"
            className={styles.wrapper}
        >
            <CustomTypography variant="h1">
                <Translation
                    nameSpace="statistics"
                    translation="common.title"
                />
            </CustomTypography>
            <CustomGrid
                container
                alignItems="center"
                justifyContent="center"
                gap={1.75}
                className={styles.tabs}
            >
                {renderTabs}
            </CustomGrid>

            <CustomGrid className={styles.fadeWrapper}>
                <Fade
                    in={activeTab.value === AnalyticsTabsValues.Users}
                    unmountOnExit
                >
                    <CustomGrid
                        className={styles.fadeContainer}
                        container
                        justifyContent="center"
                        gap={2}
                    >
                        <UsersStatistics
                            statistic={usersStatistics}
                            className={styles.statisticBlock}
                        />
                        <SubscriptionsStatistics
                            statistic={subscriptionsStatistics}
                            className={styles.statisticBlock}
                        />
                    </CustomGrid>
                </Fade>

                <Fade
                    in={activeTab.value === AnalyticsTabsValues.Rooms}
                    unmountOnExit
                >
                    <CustomGrid
                        container
                        className={clsx(
                            styles.fadeContainer,
                            styles.roomsStatistics,
                        )}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        gap={2}
                    >
                        <CommonRoomStatistics statistic={rooms} />
                        <RoomsRating />
                    </CustomGrid>
                </Fade>

                <Fade
                    in={activeTab.value === AnalyticsTabsValues.Monetization}
                    unmountOnExit
                >
                    <CustomGrid
                        className={styles.fadeContainer}
                        container
                        justifyContent="center"
                        gap={2}
                    >
                        <MonetizationStatistics
                            key="usersMonetization"
                            titleKey="usersMonetization"
                            statistic={usersMonetization}
                            className={styles.statisticBlock}
                            periods={schedulePages}
                            currentPeriod={usersPeriodType}
                            onChangePeriod={handleChangeUsersPeriod}
                            isDataLoading={isUsersMonetizationStatisticLoading}
                        />

                        <MonetizationStatistics
                            key="platformMonetization"
                            titleKey="platformMonetization"
                            statistic={platformMonetization}
                            className={styles.statisticBlock}
                            periods={schedulePages}
                            currentPeriod={platformPeriodType}
                            onChangePeriod={handleChangePlatformPeriod}
                            isDataLoading={
                                isPlatformMonetizationStatisticLoading
                            }
                        />
                    </CustomGrid>
                </Fade>
            </CustomGrid>
        </CustomGrid>
    );
};

export const Analytics = memo(Component);
