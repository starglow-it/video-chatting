import React, {
	memo, useCallback, useEffect, useMemo, useState 
} from 'react';
import {
	MenuItem 
} from '@mui/material';
import {
	useStore 
} from 'effector-react';

// shared
import {
	CustomGrid,
	CustomPaper,
	CustomTypography,
	CustomTable,
	CustomDropdown,
} from 'shared-frontend/library';

// components
import {
	Translation 
} from '@components/Translation/Translation';

// stores
import {
	$roomsRatingStatistics,
	getRoomRatingStatisticsFx,
} from '../../../store';

import styles from './RoomsRating.module.scss';

type RoomsTableDataType = {
    id: number;
    position: number;
    roomName: string;
    creator: string;
    transactions?: number;
    minutes?: number;
    calls?: number;
    money?: number;
    uniqueUsers?: number;
};

type RoomsTableHeadType = {
    tableHeadName: string;
    key: keyof RoomsTableDataType;
};

const tableColumns: RoomsTableHeadType[] = [
	{
		tableHeadName: 'Pos',
		key: 'position',
	},
	{
		tableHeadName: 'Room Name',
		key: 'roomName',
	},
	{
		tableHeadName: 'Creator',
		key: 'creator',
	},
	{
		tableHeadName: 'Transactions',
		key: 'transactions',
	},
	{
		tableHeadName: 'Money Earned',
		key: 'money',
	},
	{
		tableHeadName: 'Calls initiated',
		key: 'calls',
	},
	{
		tableHeadName: 'Minutes spent',
		key: 'minutes',
	},
	{
		tableHeadName: 'Unique users',
		key: 'uniqueUsers',
	},
];

const basedOnOptions = [
	{
		key: 'transactions',
		label: 'Transactions made in each room',
	},
	{
		key: 'money',
		label: 'Money earned in each room',
	},
	{
		key: 'minutes',
		label: 'Minutes spent',
	},
	{
		key: 'calls',
		label: 'Calls initiated',
	},
	{
		key: 'uniqueUsers',
		label: 'Unique users who selected this Room for calls',
	},
];

const roomTypes = [
	{
		key: 'custom',
		label: 'Custom Rooms',
	},
	{
		key: 'common',
		label: 'Platform Rooms',
	},
];

const formatTableValue = (key, value) => {
	if (key === 'minutes') {
		return Math.round(value / 1000 / 60);
	}

	if (key === 'money') {
		return `$${Math.round(value / 100)}`;
	}

	return value;
};

const Component = () => {
	const {
		state: roomsRating 
	} = useStore($roomsRatingStatistics);

	const [basedOnKey, setBasedOnKey] = useState(basedOnOptions[0].key);
	const [roomTypeKey, setRoomTypeKey] = useState(roomTypes[0].key);

	const renderBasedOnValues = useMemo(
		() =>
			basedOnOptions.map(option => (
				<MenuItem
					key={option.key}
					value={option.key}
				>
					{option.label}
				</MenuItem>
			)),
		[],
	);

	const renderRoomTypesValues = useMemo(
		() =>
			roomTypes.map(option => (
				<MenuItem
					key={option.key}
					value={option.key}
				>
					{option.label}
				</MenuItem>
			)),
		[],
	);

	useEffect(() => {
		getRoomRatingStatisticsFx({
			basedOn: basedOnKey,
			roomType: roomTypeKey,
		});
	}, [basedOnKey, roomTypeKey]);

	const handleChangeBasedOnKey = useCallback(({
		target: {
			value 
		} 
	}) => {
		setBasedOnKey(value);
	}, []);

	const handleChangeRoomTypeKey = useCallback(({
		target: {
			value 
		} 
	}) => {
		setRoomTypeKey(value);
	}, []);

	const tableData = useMemo(
		() =>
			roomsRating.data.map((roomRating, index) => ({
				id: {
					label: roomRating.id,
				},
				position: {
					label: index + 1,
				},
				roomName: {
					label: roomRating?.template?.[0]?.name || '-',
				},
				creator: {
					label:
                        roomRating?.author?.[0]?.fullName ||
                        roomTypeKey === 'custom'
                        	? 'Deleted user'
                        	: 'The LiveOffice Admin',
				},
				[basedOnKey]: {
					label: formatTableValue(basedOnKey, roomRating[basedOnKey]),
				},
			})),
		[roomsRating, roomTypeKey],
	);

	const tableHeadData = useMemo(
		() =>
			tableColumns.filter(column =>
				['position', 'roomName', 'creator', basedOnKey].includes(
					column.key,
				),
			),
		[roomsRating],
	);

	return (
		<CustomPaper className={styles.wrapper}>
			<CustomGrid
				container
				direction="column"
			>
				<CustomTypography
					variant="h4bold"
					className={styles.title}
				>
					<Translation
						nameSpace="statistics"
						translation="rooms.rating.title"
					/>
				</CustomTypography>
				<CustomGrid
					container
					alignItems="center"
					wrap="nowrap"
					gap={2.5}
				>
					<CustomDropdown
						label={
							<Translation
								nameSpace="statistics"
								translation="rooms.rating.based"
							/>
						}
						selectId="basedOn"
						labelId="basedOn"
						list={renderBasedOnValues}
						value={basedOnKey}
						onChange={handleChangeBasedOnKey}
					/>
					<CustomDropdown
						label={
							<Translation
								nameSpace="statistics"
								translation="rooms.rating.roomType"
							/>
						}
						selectId="roomType"
						labelId="roomType"
						list={renderRoomTypesValues}
						value={roomTypeKey}
						onChange={handleChangeRoomTypeKey}
					/>
				</CustomGrid>
				<CustomTable<RoomsTableDataType>
					columns={tableHeadData}
					data={tableData}
					bodyCellClassName={styles.cell}
					headCellClassName={styles.headCell}
					count={10}
					rowsPerPage={10}
				/>
			</CustomGrid>
		</CustomPaper>
	);
};

export const RoomsRating = memo(Component);
