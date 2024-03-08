import { memo, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useStore } from 'effector-react';
import clsx from 'clsx';

// hooks
import { useNavigation } from '@hooks/useNavigation';
import { useBrowserDetect } from 'shared-frontend/hooks/useBrowserDetect';

// shared
import { CustomChip } from 'shared-frontend/library/custom/CustomChip';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { Translation } from '@library/common/Translation/Translation';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

// styles
import styles from './Analytics.module.scss';
import { CustomDropdown } from '@library/custom/CustomDropdown/CustomDropdown';
import { MenuItem } from '@mui/material';

//components
import { AttendeesAnalytics } from './AttendeesAnalytics/AttendeesAnalytics';
import { LocationAnalytics } from './LocationAnalytics/LocationAnalytics';
import { ReactionsAnalytics } from './ReactionsAnalytics/ReactionsAnalytics';
import { QAAnalytics } from './QAAnalytics/QAAnalytics';
import { LinksAnalytics } from './LinksAnalytics/LinksAnalytics';
import { MonetizationAnalytics } from './MonetizationAnalytics/MonetizationAnalytics';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';

import {
    StatisticsTabsValues,
    statisticTabs,
} from '../../const/statistics';

//store
import {
    $profileStore,
    $roomsStatistics,
    $roomsStatisticsLoading,
    getRoomRatingStatisticsFx,
    setRoomStatisticsLoadingEvent
} from '../../store';
import {
    $isMeetingSocketConnected,
    initiateMeetingSocketConnectionFx,
    getStatisticsSocketEvent,
} from '../../store/roomStores';

interface RoomName {
    id: any; // Consider using a more specific type than 'any' for better type safety.
    name: string;
}

const Component = () => {
    const profileStore = useStore($profileStore);
    const roomsStatistics = useStore($roomsStatistics);
    const roomsStatisticsLoading = useStore($roomsStatisticsLoading);
    const isMeetingSocketConnected = useStore($isMeetingSocketConnected);
    const [basedOnKey, setBasedOnKey] = useState('');
    const [roomNames, setRoomNames] = useState<RoomName[]>([]);
    const [attendeesData, setAttendeesData] = useState({});
    const [locationData, setLocationData] = useState<any>({ data: [] });
    const [reactions, setReactions] = useState({});
    const [qa, setQa] = useState<any>([]);
    const [meetingLinks, setMeetingLinks] = useState({});
    const [monetization, setMonetization] = useState({});
    const { activeTab, onChange: onChangeTab } = useNavigation({
        tabs: statisticTabs,
    });
    const { isMobile } = useBrowserDetect();

    useEffect(() => {
        if (Object.keys(roomsStatistics).length != 0) {
            const roomNamesList = Array.isArray(roomsStatistics.meetingNames)
                ? roomsStatistics.meetingNames
                    .map(meeting => ({
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
            if (roomNamesList.length > 0 && !basedOnKey) {
                setBasedOnKey(roomNamesList[0].id);
            }
        }
    }, [roomsStatistics]);

    useEffect(() => {
        (async () => {
            await initiateMeetingSocketConnectionFx({ isStatistics: true });
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (isMeetingSocketConnected) {
                setRoomStatisticsLoadingEvent(true);
                await getStatisticsSocketEvent({ profileId: profileStore.id });
            }
        })();
    }, [isMeetingSocketConnected]);


    useEffect(() => {
        getRoomRatingStatisticsFx({
            basedOn: 'createdAt',
            roomType: profileStore.id,
        });
    }, []);

    useEffect(() => {
        (() => {
            getStatisticsSocketEvent({ meetingId: basedOnKey, profileId: profileStore.id });
            setRoomStatisticsLoadingEvent(true);
        }
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
                    key={translationKey}
                    active={value === activeTab.value}
                    className={clsx(styles.chip, {
                        [styles.chipResponsiveVisible]: translationKey === 'monetizationResponsive',
                        [styles.chipResponsiveInVisible]: translationKey === 'monetization'
                    })}
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
                <CustomBox className={clsx(styles.dropdownMenu, { [styles.mobile]: isMobile })}>
                    <CustomDropdown
                        nameSpace="common"
                        translation="statistics.rooms.rating.dropdownTitle"
                        selectId="basedOn"
                        labelId="basedOn"
                        list={renderRooms}
                        value={basedOnKey}
                        onChange={handleChangeBasedOnKey}
                    />
                </CustomBox>
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
                {
                    roomsStatisticsLoading
                        ? <CustomLoader className={styles.loader} />
                        : Object.keys(roomsStatistics).length > 0 ?
                            <>
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
                                            statistic={reactions}
                                            className={styles.statisticBlock}
                                        />
                                    </CustomGrid>
                                </ConditionalRender>
                                <ConditionalRender condition={activeTab.value === StatisticsTabsValues.QA}>
                                    <CustomGrid
                                        container
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
                            </> :
                            <>

                            </>
                }
            </CustomGrid>
        </CustomGrid>
    );
};

export const Analytics = memo(Component);
