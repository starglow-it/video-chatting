import {
	memo, useCallback, useEffect, useMemo, useState 
} from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';
import debounce from '@mui/utils/debounce';

import { useLocalization } from '@hooks/useTranslation';

// shared
import { PlusIcon } from 'shared-frontend/icons/OtherIcons/PlusIcon';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomChip } from 'shared-frontend/library/custom/CustomChip';
import { CustomTable } from 'shared-frontend/library/custom/CustomTable';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';

// components
import { Translation } from '@components/Translation/Translation';
import { RoomsTablePreviewItem } from '@components/Rooms/RoomsTablePreviewItem/RoomsTablePreviewItem';
import { RoomTableItemActions } from '@components/Rooms/RoomTableItemActions/RoomTableItemActions';
import { RoomPreviewDialog } from '@components/Dialogs/RoomPreviewDialog/RoomPreviewDialog';
import { ConfirmDeleteRoomDialog } from '@components/Dialogs/ConfirmDeleteRoomDialog/ConfirmDeleteRoomDialog';

// styles
import { ICommonTemplate } from 'shared-types';
import { PublishRoomDialog } from '@components/Dialogs/PublishRoomDialog/PublishRoomDialog';
import { RevokeRoomDialog } from '@components/Dialogs/RevokeRoomDialog/RevokeRoomDialog';

// styles
import styles from './RoomsContainer.module.scss';

// store
import {
	$commonTemplates,
	createTemplateFx,
	getCommonTemplatesFx,
	openAdminDialogEvent,
	setActiveTemplateIdEvent,
} from '../../store';

// types
import { AdminDialogsEnum } from '../../store/types';

type TableCell<LabelType = string> = {
    style?: string;
    label: LabelType;
    action?: () => void;
};

type RoomsTableDataType = {
    id: string;
    previewAndRoomName: TableCell<JSX.Element>;
    participants: TableCell;
    price: TableCell;
    status: TableCell;
};

type UsersTableHeadType = {
    tableHeadName: string;
    key: keyof RoomsTableDataType;
};

const tableColumnsKeys: UsersTableHeadType['key'][] = [
	'previewAndRoomName',
	'participants',
	'price',
	'status',
];

const ROOMS_LIMIT = 9;

const Component = () => {
	const {
		state: commonTemplates 
	} = useStore($commonTemplates);

	const isRoomsLoading = useStore(getCommonTemplatesFx.pending);

	const {
		translation 
	} = useLocalization('rooms');

	const [page, setPage] = useState(1);

	useEffect(() => {
		getCommonTemplatesFx({
			draft: false,
			limit: ROOMS_LIMIT,
			skip: 0,
		});
	}, []);

	const handleCreateRoom = useCallback(() => {
		createTemplateFx();
	}, []);

	const tableHeadData = useMemo(
		() =>
			tableColumnsKeys.map(key => ({
				key,
				tableHeadName: translation(`table.${key}`),
			})),
		[],
	);

	const tableData = useMemo(
		() =>
			commonTemplates?.list?.map(template => {
				const templatePreview = (
					template.previewUrls?.length
						? template.previewUrls
						: template.draftPreviewUrls
				)?.find(preview => preview.resolution === 240);

				return {
					id: template.id,
					previewAndRoomName: {
						label: (
							<RoomsTablePreviewItem
								src={templatePreview?.url}
								roomName={template.name}
							/>
						),
					},
					participants: {
						label: template.maxParticipants,
					},
					price: {
						label:
                            template.type === 'paid' && template.priceInCents
                            	? `$${template.priceInCents / 100}`
                            	: 'Free',
					},
					status: {
						label: !template.isPublic ? 'Pending' : 'Published',
						style: clsx(styles.roomStatus, {
							[styles.published]: template.isPublic,
							[styles.pending]: !template.isPublic,
						}),
					},
				};
			}),
		[commonTemplates?.list],
	);

	const roomsRequest = useMemo(
		() =>
			debounce<(data: { page: number }) => Promise<void>>(
				async ({
					page: newPage 
				}) => {
					getCommonTemplatesFx({
						draft: false,
						skip: (newPage - 1) * ROOMS_LIMIT,
						limit: ROOMS_LIMIT,
					});
				},
			500,
			),
		[],
	);

	useEffect(() => {
		roomsRequest({
			page,
		});
	}, [page]);

	const handleChangePage = useCallback((newPage: number) => {
		setPage(newPage);
	}, []);

	const handleOpenRoomPreview = useCallback(
		({
			itemId 
		}: { itemId: ICommonTemplate['id'] }) => {
			setActiveTemplateIdEvent(itemId);
			openAdminDialogEvent(AdminDialogsEnum.roomPreviewDialog);
		},
		[],
	);

	return (
		<CustomGrid
			container
			direction="column"
			alignItems="center"
			className={styles.wrapper}
		>
			<CustomGrid
				container
				justifyContent="center"
				alignItems="center"
				gap={1.5}
			>
				<CustomTypography variant="h1">
					<Translation
						nameSpace="rooms"
						translation="common.title"
					/>
				</CustomTypography>
				{commonTemplates?.count ? (
					<CustomChip
						withoutAction
						className={styles.chip}
						active
						label={commonTemplates.count}
					/>
				) : null}
			</CustomGrid>

			{commonTemplates.count === 0 ? (
				<CustomGrid
					className={styles.noRoomWrapper}
					container
					direction="column"
					justifyContent="center"
					alignItems="center"
				>
					<CustomImage
						src="/images/blush_face.webp"
						width={40}
						height={40}
					/>
					<CustomTypography variant="body2">
						<Translation
							nameSpace="rooms"
							translation="noRooms"
						/>
					</CustomTypography>
					<CustomChip
						active
						label={
							<CustomTypography>
								<Translation
									nameSpace="rooms"
									translation="createRoom"
								/>
							</CustomTypography>
						}
						size="medium"
						onClick={handleCreateRoom}
						icon={<PlusIcon
							width="24px"
							height="24px"
						      />}
						className={styles.createRoomButton}
					/>
				</CustomGrid>
			) : (
				<CustomGrid
					container
					direction="column"
				>
					<CustomChip
						active
						label={
							<CustomTypography>
								<Translation
									nameSpace="rooms"
									translation="createRoom"
								/>
							</CustomTypography>
						}
						size="medium"
						onClick={handleCreateRoom}
						icon={<PlusIcon
							width="24px"
							height="24px"
						      />}
						className={styles.createRoomButton}
					/>
					<CustomPaper className={styles.roomsContainer}>
						<CustomTable<RoomsTableDataType>
							columns={tableHeadData}
							data={tableData}
							count={commonTemplates.count}
							rowsPerPage={ROOMS_LIMIT}
							page={page}
							onPageChange={handleChangePage}
							isTableUpdating={isRoomsLoading}
							bodyCellClassName={styles.cell}
							headCellClassName={styles.headCell}
							ActionsComponent={RoomTableItemActions}
							onRowAction={handleOpenRoomPreview}
						/>
					</CustomPaper>
				</CustomGrid>
			)}
			<RoomPreviewDialog />
			<PublishRoomDialog />
			<RevokeRoomDialog />
			<ConfirmDeleteRoomDialog />
		</CustomGrid>
	);
};

export const RoomsContainer = memo(Component);
