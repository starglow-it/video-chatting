import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { useStore } from 'effector-react';
import clsx from 'clsx';

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
import { CustomDropdown } from '@library/custom/CustomDropdown/CustomDropdown';
import { Fade, MenuItem } from '@mui/material';

//components
import { AttendeesAnalytics } from './AttendeesAnalytics/AttendeesAnalytics';
import { LocationAnalytics } from './LocationAnalytics/LocationAnalytics';
import { ReactionsAnalytics } from './ReactionsAnalytics/ReactionsAnalytics';
import { QAAnalytics } from './QAAnalytics/QAAnalytics';
import { LinksAnalytics } from './LinksAnalytics/LinksAnalytics';
import { MonetizationAnalytics } from './MonetizationAnalytics/MonetizationAnalytics';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

import {
    StatisticsTabsValues,
    statisticTabs,
} from '../../const/statistics';

//store
import {
    $profileStore,
    $roomsRatingStatistics,
    getRoomRatingStatisticsFx,
} from '../../store';

enum Tabs {
    TermsOfService = 'termsOfService',
    PrivacyPolicy = 'privacyPolicy',
}

//mockups
const roomNameMockups = [
    { id: 1, name: "room-1" },
    { id: 2, name: "room-2" },
    { id: 3, name: "room-3" },
];

const numberOfAttendeesMockups = {
    totalNumber: 43,
    participants: 4,
    audience: 39,
    participantsAvgMin: 60,
    audienceAvgMin: 30,
};

const locationMockups = {
    data: [
        {
            country: 'canada',
            state: [
                { name: 'british columbia', num: 10 },
                { name: 'toronto', num: 5 },
                { name: 'ontario', num: 15 },
            ],
            num: 30
        },
        { country: 'united states', num: 39 },
        { country: 'Germany', num: 5 },
        { country: 'United Kingdom', num: 10 },
        { country: 'Argentina', num: 2 },
    ]
}

const qaMockups = {
    data: {
        questions: [
            { content: 'What is your favorite color?', who: 'John Doe', answered: false },
            { content: 'What is your favorite food?', who: 'John Jensen', answered: true },
            { content: 'What day is it?', who: 'John Belle', answered: true },
        ]
    }
}

const linksMockups = {
    data: [
        { link: 'https://www.test1.com', click: 30, clickThroughRate: 5 },
        { link: 'https://www.test2.com', click: 10, clickThroughRate: 10 },
        { link: 'https://www.test3.com', click: 20, clickThroughRate: 50 },
        { link: 'https://www.test4.com', click: 50, clickThroughRate: 70 },
    ]
}

const monetizationMockups = {
    data: { entryFee: 5, total: 255, donations: 0 }
}

const Component = () => {
    const { translation } = useLocalization('static');
    const profileStore = useStore($profileStore);
    const roomsRatingStatistics = useStore($roomsRatingStatistics);
    const [basedOnKey, setBasedOnKey] = useState('');
    const { activeTab, onChange: onChangeTab } = useNavigation({
        tabs: statisticTabs,
    });
    const router = useRouter();

    useEffect(() => {
        if (router.query.section === 'privacy') {
            onChangeTab(Tabs.PrivacyPolicy);
        }
    }, [router.query]);

    useEffect(() => {
        getRoomRatingStatisticsFx({
            basedOn: 'createdAt',
            roomType: profileStore.id,
        });
    }, []);

    const renderRooms = useMemo(
        () =>
            roomNameMockups.map(room => (
                <MenuItem key={room.id} value={room.id}>
                    {room.name}
                </MenuItem>
            )),
        [],
    );

    const renderTabs = useMemo(
        () =>
            statisticTabs.map(({ value, translationKey }) => (
                <CustomChip
                    key={value}
                    active={value === activeTab.value}
                    className={styles.chip}
                    label={
                        <CustomTypography>
                            <Translation
                                nameSpace="common"
                                translation={`statistics.pages.${translationKey}.title`}
                            />
                        </CustomTypography>
                    }
                    onClick={() => onChangeTab(value)}
                />
            )),
        [activeTab],
    );

    const handleChangeBasedOnKey = useCallback(({ target: { value } }) => {
        setBasedOnKey(value);
    }, []);

    return (
        <CustomGrid
            container
            direction="column"
            alignItems="center"
            justifyContent="flex-start"
            className={styles.wrapper}
        >
            <CustomGrid
                item
                container
                direction="row"
                alignItems="center"
                justifyContent="center"
                className={styles.tabs}
            >
                <CustomGrid item md={4} xs={3}></CustomGrid>
                <CustomGrid item md={4} xs={6}>
                    <CustomDropdown
                        nameSpace="common"
                        translation="statistics.rooms.rating.dropdownTitle"
                        selectId="basedOn"
                        labelId="basedOn"
                        list={renderRooms}
                        value={basedOnKey}
                        onChange={handleChangeBasedOnKey}
                    />
                </CustomGrid>
                <CustomGrid item md={4} xs={3}></CustomGrid>
            </CustomGrid>
            <CustomGrid
                item
                container
                alignItems="center"
                justifyContent="center"
                gap={8}
                className={styles.tabs}
            >
                {renderTabs}
            </CustomGrid>
            <CustomGrid item container className={styles.fadeWrapper}>
                <ConditionalRender condition={activeTab.value === StatisticsTabsValues.Users}>
                    <CustomGrid
                        item
                        container
                        justifyContent="center"
                        gap={3}
                    >
                        <AttendeesAnalytics
                            statistic={numberOfAttendeesMockups}
                            className={styles.statisticBlock}
                        />
                        <LocationAnalytics
                            statistic={locationMockups}
                            className={styles.statisticBlock}
                        />
                        <ReactionsAnalytics
                            statistic={numberOfAttendeesMockups}
                            className={styles.statisticBlock}
                        />
                    </CustomGrid>
                </ConditionalRender>
                <ConditionalRender condition={activeTab.value === StatisticsTabsValues.QA}>
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
                        <QAAnalytics
                            statistic={qaMockups}
                            className={styles.qaAnalyticsBlock}
                        />
                    </CustomGrid>
                </ConditionalRender>
                <ConditionalRender
                    condition={activeTab.value === StatisticsTabsValues.Links}
                >
                    <CustomGrid
                        className={styles.fadeContainer}
                        container
                        justifyContent="center"
                        gap={2}
                    >
                        <LinksAnalytics
                            statistic={linksMockups}
                            className={styles.qaAnalyticsBlock}
                        />
                    </CustomGrid>
                </ConditionalRender>
                <ConditionalRender
                    condition={activeTab.value === StatisticsTabsValues.Monetization}
                >
                    <CustomGrid
                        className={styles.fadeContainer}
                        container
                        justifyContent="center"
                        gap={2}
                    >
                        <MonetizationAnalytics
                            statistic={monetizationMockups}
                            className={styles.qaAnalyticsBlock}
                        />
                    </CustomGrid>
                </ConditionalRender>
            </CustomGrid>
        </CustomGrid>
    );
};

export const Analytics = memo(Component);
