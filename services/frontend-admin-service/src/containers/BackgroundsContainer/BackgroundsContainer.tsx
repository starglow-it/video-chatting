import { Translation } from '@components/Translation/Translation';
import { memo, useEffect } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import styles from './BackgroundsContainer.module.scss';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';

import { CategoryItem } from '@components/Backgrounds/CategoryItem/CategoryItem';
import { MediaItem } from '@components/Backgrounds/MediaItem/MediaItem';

import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { UploadFolderIcon } from 'shared-frontend/icons/OtherIcons/UploadFolderIcon';
import { $backgroundsManageStore, getCategoriesFx } from 'src/store';
import { useStore } from 'effector-react';

const Component = () => {
    const { categories } = useStore($backgroundsManageStore);
    useEffect(() => {
        (async () => getCategoriesFx())();
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
                    <CustomGrid sm={4} marginRight={2}>
                        <CustomPaper className={styles.paper}>
                            <CustomGrid className={styles.header}>
                                <CustomTypography variant="h4" fontSize={16}>
                                    <Translation
                                        nameSpace="common"
                                        translation="backgrounds.title"
                                    />
                                </CustomTypography>
                            </CustomGrid>
                            <CustomGrid container>
                                {categories.map(item => (
                                    <CategoryItem
                                        key={item.id}
                                        category={item}
                                    />
                                ))}
                            </CustomGrid>
                        </CustomPaper>
                    </CustomGrid>
                    <CustomGrid sm={7}>
                        <CustomPaper className={styles.paper}>
                            <CustomGrid
                                className={styles.actions}
                                display="flex"
                                justifyContent="flex-end"
                            >
                                <ActionButton
                                    className={styles.button}
                                    // onAction={handleRoomAction}
                                    variant="decline"
                                    label={
                                        <CustomTypography variant="body2">
                                            <Translation
                                                nameSpace="rooms"
                                                translation="buttons.revoke"
                                            />
                                        </CustomTypography>
                                    }
                                    Icon={
                                        <UploadFolderIcon
                                            width="22px"
                                            height="22px"
                                        />
                                    }
                                />
                            </CustomGrid>
                            <PerfectScrollbar className={styles.scroll}>
                                <MediaItem />
                                <MediaItem />
                                <MediaItem />
                            </PerfectScrollbar>
                        </CustomPaper>
                    </CustomGrid>
                </CustomGrid>
            </CustomGrid>
        </CustomGrid>
    );
};

export const BackgroundsContainer = memo(Component);
