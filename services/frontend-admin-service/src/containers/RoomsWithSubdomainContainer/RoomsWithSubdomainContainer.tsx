import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import styles from './RoomsWithSubdomainContainer.module.scss';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { Translation } from '@components/Translation/Translation';
import {
    $commonTemplates,
    createTemplateFx,
    getCommonTemplatesFx,
    openAdminDialogEvent,
    setActiveTemplateIdEvent,
} from 'src/store';
import { useStore } from 'effector-react';
import { useLocalization } from '@hooks/useTranslation';
import { CustomChip } from 'shared-frontend/library/custom/CustomChip';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { PlusIcon } from 'shared-frontend/icons/OtherIcons/PlusIcon';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomTable } from 'shared-frontend/library/custom/CustomTable';
import { RoomsTablePreviewItem } from '@components/Rooms/RoomsTablePreviewItem/RoomsTablePreviewItem';
import clsx from 'clsx';
import { RoomTableItemActions } from '@components/Rooms/RoomTableItemActions/RoomTableItemActions';
import { ICommonTemplate, RoomType } from 'shared-types';
import { AdminDialogsEnum } from 'src/store/types';
import { RoomPreviewDialog } from '@components/Dialogs/RoomPreviewDialog/RoomPreviewDialog';
import { PublishRoomDialog } from '@components/Dialogs/PublishRoomDialog/PublishRoomDialog';
import { RevokeRoomDialog } from '@components/Dialogs/RevokeRoomDialog/RevokeRoomDialog';
import { ConfirmDeleteRoomDialog } from '@components/Dialogs/ConfirmDeleteRoomDialog/ConfirmDeleteRoomDialog';

type TableCell<LabelType = string> = {
    style?: string;
    label: LabelType;
    action?: () => void;
};

type RoomsTableDataType = {
    id: string;
    previewAndRoomName: TableCell<JSX.Element>;
    subdomain: TableCell;
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
    'subdomain',
    'participants',
    'price',
    'status',
];

const ROOMS_LIMIT = 9;

export const RoomsWithSubdomainContainer = () => {
    const { state: commonTemplates } = useStore($commonTemplates);

    const isRoomsLoading = useStore(getCommonTemplatesFx.pending);

    const { translation } = useLocalization('rooms');

    const [page, setPage] = useState(1);

    useEffect(() => {
        getCommonTemplatesFx({
            draft: false,
            limit: ROOMS_LIMIT,
            skip: 0,
            roomType: RoomType.Normal,
            isHaveSubdomain: true
        });
    }, []);

    const handleCreateRoom = useCallback(() => {
        createTemplateFx(true);
    }, []);

    const renderEmpty = () => {
        return (
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
                    <Translation nameSpace="rooms" translation="noRooms" />
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
                    icon={<PlusIcon width="24px" height="24px" />}
                    className={styles.createRoomButton}
                />
            </CustomGrid>
        );
    };

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
                    subdomain: {
                        label:  template.subdomain
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

    const handleChangePage = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    const handleOpenRoomPreview = useCallback(
        ({ itemId }: { itemId: ICommonTemplate['id'] }) => {
            setActiveTemplateIdEvent(itemId);
            openAdminDialogEvent(AdminDialogsEnum.roomPreviewDialog);
        },
        [],
    );

    const renderContent = () => {
        return (
            <CustomGrid container direction="column">
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
                    icon={<PlusIcon width="24px" height="24px" />}
                    className={styles.createRoomButton}
                />
                <CustomPaper className={styles.roomsContainer}>
                    <CustomTable<RoomsTableDataType>
                        columns={tableHeadData}
                        data={tableData as any}
                        count={commonTemplates.count}
                        rowsPerPage={ROOMS_LIMIT}
                        page={page}
                        onPageChange={handleChangePage}
                        isTableUpdating={isRoomsLoading}
                        bodyCellClassName={styles.cell}
                        headCellClassName={styles.headCell}
                        ActionsComponent={RoomTableItemActions}
                        onRowAction={handleOpenRoomPreview}
                        withSubdomain
                    />
                </CustomPaper>
            </CustomGrid>
        );
    };

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
                    <Translation nameSpace="rooms" translation="common.title" />
                </CustomTypography>
                {commonTemplates?.count ? (
                    <CustomChip
                        withoutAction
                        className={styles.chip}
                        active
                        label={commonTemplates.count}
                    />
                ) : null}
                {!commonTemplates?.count ? renderEmpty() : renderContent()}
            </CustomGrid>
            <RoomPreviewDialog />
            <PublishRoomDialog />
            <RevokeRoomDialog />
            <ConfirmDeleteRoomDialog />
        </CustomGrid>
    );
};
