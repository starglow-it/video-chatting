import { Translation } from '@components/Translation/Translation';
import { memo, useCallback, useEffect } from 'react';
import Router from "next/router";
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import styles from './FeaturedBackgroundContainer.module.scss';
import {
    $featuredBackgroundStore,
    createFeaturedBackgroundFx,
    createFeaturedTemplateFx,
    deleteFeaturedBackground,
    getFeaturedTemplatesFx,
} from 'src/store';
import { useStore } from 'effector-react';
import { ConfirmDeleteMediaDialog } from '@components/Dialogs/ConfirmDeleteMediaDialog/ConfirmDeleteMediaDialog';
import { ConfirmDeleteCategoryDialog } from '@components/Dialogs/ConfirmDeleteCategoryDialog/ConfirmDeleteCategoryDialog';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { mapEmoji, parseEmoji } from 'shared-utils';
import { FeaturedItem } from '@components/FeaturedBackground/FeaturedItem/FeaturedItem';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { CustomChip } from 'shared-frontend/library/custom/CustomChip';
import { PlusIcon } from 'shared-frontend/icons/OtherIcons/PlusIcon';
import { RoomType } from 'shared-types';

const Component = () => {
    const { list } = useStore($featuredBackgroundStore);
    const isLoading = useStore(createFeaturedBackgroundFx.pending);

    useEffect(() => {
        (async () =>
            getFeaturedTemplatesFx({
                skip: 0,
                limit: 9,
                roomType: RoomType.Featured,
                draft: false
            }))();
    }, []);

    const handleDeleteMedia = (id: string) => {
        deleteFeaturedBackground(id);
    };

    const handleCreateRoom = useCallback(() => {
        createFeaturedTemplateFx();
    }, []);

    const handleEditMedia = (id: string) => {
        Router.push(`/rooms/edit/${id}`);
    }

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
                direction="column"
                gap={1.5}
            >
                <CustomTypography variant="h1">
                    <Translation
                        nameSpace="common"
                        translation="featuredRooms.title"
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
                    icon={<PlusIcon width="24px" height="24px" />}
                    className={styles.createRoomButton}
                />
                <CustomGrid
                    container
                    justifyContent="center"
                    alignItems="flex-start"
                >
                    <CustomPaper className={styles.paper}>
                        <ConditionalRender condition={Boolean(list.length)}>
                            <PerfectScrollbar
                                className={styles.scroll}
                                // onYReachEnd={handleScrollEnd}
                            >
                                {list.map(item => (
                                    <FeaturedItem
                                        key={item.id}
                                        template={item}
                                        onDelete={handleDeleteMedia}
                                        onEdit={handleEditMedia}
                                    />
                                ))}
                            </PerfectScrollbar>
                        </ConditionalRender>
                        <ConditionalRender condition={!list.length}>
                            <CustomGrid
                                container
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                height="200px"
                                bgcolor="#f4f6f9"
                                flexDirection="column"
                            >
                                <CustomGrid fontSize={30}>
                                    {parseEmoji(mapEmoji('1f3a5'))}
                                </CustomGrid>
                                <CustomTypography variant="h4" fontSize={16}>
                                    <Translation
                                        nameSpace="rooms"
                                        translation="backgrounds.emptyMedias"
                                    />
                                </CustomTypography>
                            </CustomGrid>
                        </ConditionalRender>
                    </CustomPaper>
                </CustomGrid>
            </CustomGrid>
            <ConfirmDeleteMediaDialog />
            <ConfirmDeleteCategoryDialog />
        </CustomGrid>
    );
};

export const FeaturedBackgroundContainer = memo(Component);
