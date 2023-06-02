import { Translation } from '@components/Translation/Translation';
import { memo, useEffect } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import styles from './FeaturedBackgroundContainer.module.scss';
import {
    $backgroundsManageStore,
    $featuredBackgroundStore,
    getCategoriesFx,
    getFeaturedBackgroundFx,
    selectCategoryEvent,
} from 'src/store';
import { useStore } from 'effector-react';
import { Medias } from '@components/Backgrounds/Medias/Medias';
import { ConfirmDeleteMediaDialog } from '@components/Dialogs/ConfirmDeleteMediaDialog/ConfirmDeleteMediaDialog';
import { ConfirmDeleteCategoryDialog } from '@components/Dialogs/ConfirmDeleteCategoryDialog/ConfirmDeleteCategoryDialog';
import { Categories } from '@components/Backgrounds/Categories/Categories';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { UploadFolderIcon } from 'shared-frontend/icons/OtherIcons/UploadFolderIcon';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { LinearProgress } from '@mui/material';
import { mapEmoji, parseEmoji } from 'shared-utils';

const Component = () => {
    const { list } = useStore($featuredBackgroundStore);

    useEffect(() => {
        (async () => getFeaturedBackgroundFx({ skip: 0, limit: 6 }))();
    }, []);

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
                        nameSpace="common"
                        translation="backgrounds.title"
                    />
                </CustomTypography>
                <CustomGrid
                    container
                    justifyContent="center"
                    alignItems="flex-start"
                >
                    <CustomGrid>
                        <CustomPaper className={styles.paper}>
                            <CustomGrid
                                className={styles.actions}
                                display="flex"
                                justifyContent="flex-end"
                            >
                                <CustomGrid container>
                                    <CustomTypography
                                        variant="h4bold"
                                        fontSize={16}
                                    >
                                        <Translation
                                            nameSpace="rooms"
                                            translation="backgrounds.medias"
                                        />
                                    </CustomTypography>
                                </CustomGrid>
                                <CustomGrid>
                                    <ActionButton
                                        className={styles.button}
                                        variant="decline"
                                        // onAction={onClick}
                                        Icon={
                                            <CustomGrid>
                                                <UploadFolderIcon
                                                    width="18px"
                                                    height="18px"
                                                />
                                                <ConditionalRender
                                                    condition={isLoading}
                                                >
                                                    <LinearProgress
                                                        classes={{
                                                            root: styles.progressBar,
                                                        }}
                                                    />
                                                </ConditionalRender>
                                            </CustomGrid>
                                        }
                                    />
                                </CustomGrid>
                            </CustomGrid>
                            {/* <input {...getInputProps()} /> */}
                            {/* <ConditionalRender condition={list.length}>
                                <PerfectScrollbar
                                    className={styles.scroll}
                                    onYReachEnd={handleScrollEnd}
                                    containerRef={el =>
                                        (refScroll.current = el)
                                    }
                                >
                                    {list.map(item => (
                                        <MediaItem
                                            key={item.id}
                                            media={item}
                                            onDelete={handleDeleteMedia}
                                        />
                                    ))}
                                </PerfectScrollbar>
                            </ConditionalRender> */}
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
                                    <CustomTypography
                                        variant="h4"
                                        fontSize={16}
                                    >
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
            </CustomGrid>
            <ConfirmDeleteMediaDialog />
            <ConfirmDeleteCategoryDialog />
        </CustomGrid>
    );
};

export const FeaturedBackgroundContainer = memo(Component);
