import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useStore } from 'effector-react';
import clsx from 'clsx';

// hooks
import { useLocalization } from '@hooks/useTranslation';
import { useNavigation } from '@hooks/useNavigation';

// shared
import { CustomChip } from 'shared-frontend/library/custom/CustomChip';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { Translation } from '@library/common/Translation/Translation';

// styles
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
    $roomsStatistics,
    getRoomRatingStatisticsFx,
} from '../../store';
import {
    $isMeetingSocketConnected,
    initiateMeetingSocketConnectionFx,
    getStatisticsSocketEvent,
} from '../../store/roomStores';

enum Tabs {
    TermsOfService = 'termsOfService',
    PrivacyPolicy = 'privacyPolicy',
}

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
    const roomsStatistics = useStore($roomsStatistics);
    const isMeetingSocketConnected = useStore($isMeetingSocketConnected);
    const [basedOnKey, setBasedOnKey] = useState('');
    const { activeTab, onChange: onChangeTab } = useNavigation({
        tabs: statisticTabs,
    });
    const router = useRouter();
    const [roomNames, setRoomNames] = useState([]);
    const [attendeesData, setAttendeesData] = useState({});
    const [locationData, setLocationData] = useState({ data: [] });
    const [reactions, setReactions] = useState({});
    const [qa, setQa] = useState([]);
    const [meetingLinks, setMeetingLinks] = useState({});
    const [monetization, setMonetization] = useState({});

    useEffect(() => {
        const roomNamesList = Array.isArray(roomsStatistics.meetingNames)
            ? roomsStatistics.meetingNames.map(meeting => ({
                id: meeting.id,
                name: `${meeting.name} - ${meeting.startedAt}`
            }))
            : [];

        const attendeesDataInstance = {
            totalNumber: roomsStatistics.attendeesData.totalParticipants + roomsStatistics.attendeesData.totalAudiences,
            participants: roomsStatistics.attendeesData.totalParticipants,
            audience: roomsStatistics.attendeesData.totalAudiences,
            participantsAvgMin: roomsStatistics.attendeesData.participantAverageMeetingTime,
            audienceAvgMin: roomsStatistics.attendeesData.audienceAverageMeetingTime,
        };

        const locationStatistics = {
            data: Array.isArray(roomsStatistics.countriesArray)
                ? roomsStatistics.countriesArray.map(country => {
                    return {
                        country: country.country,
                        state: country?.states?.map(state => ({
                            name: state.state,
                            num: state.count
                        })),
                        num: country.count
                    };
                })
                : []
        };

        const qaStatistics = {
            data: {
                questions: roomsStatistics.qaStatistics
            }
        };

        const meetingLinksStatistics = {
            data: Array.isArray(roomsStatistics.countriesArray)
                ? roomsStatistics.meetingLinks.map(link => ({
                    link: link.url,
                    click: link.clicks,
                    clickThroughRate: link.clickThroughRate
                }))
                : []
        };

        const monetizationStatistics = {
            data: roomsStatistics.monetization
        };

        setRoomNames(roomNamesList);
        setAttendeesData(attendeesDataInstance);
        setLocationData(locationStatistics);
        setReactions(roomsStatistics.reactions);
        setQa(qaStatistics);
        setMeetingLinks(meetingLinksStatistics);
        setMonetization(monetizationStatistics);
    }, [roomsStatistics]);

    useEffect(() => {
        (async () => {
            await initiateMeetingSocketConnectionFx({ isStatistics: true });
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (isMeetingSocketConnected) {
                await getStatisticsSocketEvent({ profileId: profileStore.id });
            }
        })();
    }, [isMeetingSocketConnected]);

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

    useEffect(() => {
        (() =>
            getStatisticsSocketEvent({ meetingId: basedOnKey, profileId: profileStore.id })
        )();
    }, [basedOnKey]);

    const renderRooms = useMemo(
        () =>
            roomNames.map(room => (
                <MenuItem key={room.id} value={room.id}>
                    {room.name}
                </MenuItem>
            )),
        [roomNames],
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

    const handleSendMeetingUsresStatisticsRequest = async (meetingId) => {
        await getStatisticsSocketEvent({ meetingId, profileId: profileStore.id });
    };

    const handleChangeBasedOnKey = ({ target: { value } }) => {
        setBasedOnKey(value);
    };

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
                className={styles.tabs}
            >
                <CustomGrid
                    item
                    container
                    alignItems="center"
                    justifyContent="space-between"
                    className={styles.innerTabs}
                >
                    {renderTabs}
                </CustomGrid>
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
                            statistic={attendeesData}
                            className={styles.statisticBlock}
                        />
                        <LocationAnalytics
                            statistic={locationData}
                            className={styles.statisticBlock}
                        />
                        <ReactionsAnalytics
                            statistic={attendeesData}
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
                            statistic={qa}
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
                            statistic={meetingLinks}
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
                            statistic={monetization}
                            className={styles.qaAnalyticsBlock}
                        />
                    </CustomGrid>
                </ConditionalRender>
            </CustomGrid>
        </CustomGrid>
    );
};

export const Analytics = memo(Component);
