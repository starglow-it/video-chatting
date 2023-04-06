import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { Fade } from '@mui/material';
import clsx from 'clsx';
import { useStore } from 'effector-react';
import { memo, useEffect } from 'react';
import { RoundCloseIcon } from 'shared-frontend/icons/RoundIcons/RoundCloseIcon';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { $businessCategoriesStore } from 'src/store';
import {
    $backgroundMeetingStore,
    $isToggleChangeBackground,
    setCategoryEvent,
    setMediaEvent,
    toggleChangeBackgroundEvent,
} from '../../../store/roomStores';
import { Barge } from './Barge';
import { Images } from './Images';
import styles from './MeetingChangeBackground.module.scss';

const Component = () => {
    const isToggleChangeBackground = useStore($isToggleChangeBackground);
    const { medias, categorySelected, mediaSelected } = useStore(
        $backgroundMeetingStore,
    );
    const { list: categories } = useStore($businessCategoriesStore);

    useEffect(() => {
        if (categories.length)
            setCategoryEvent({ categorySelected: categories[0].id });
    }, []);

    const handleSelectBackground = (id: string) => {
        setMediaEvent({ mediaSelected: id });
    };

    const handleSelectType = (id: string) => {
        setCategoryEvent({ categorySelected: id });
    };

    return (
        <Fade in={isToggleChangeBackground}>
            <CustomPaper
                variant="black-glass"
                className={clsx(styles.commonOpenPanel)}
            >
                <CustomGrid flex={1} container flexDirection="column">
                    <CustomBox
                        display="flex"
                        className={styles.headers}
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="flex-start"
                    >
                        <CustomTypography
                            nameSpace="meeting"
                            translation="changeBackground.text"
                            color="colors.white.primary"
                            variant="h4bold"
                            flex={1}
                        />
                        <RoundCloseIcon
                            className={styles.closeIcon}
                            onClick={toggleChangeBackgroundEvent}
                            isActive
                            width="24px"
                            height="24px"
                        />
                    </CustomBox>
                    <CustomBox
                        flex={25}
                        display="flex"
                        flexDirection="row"
                        flexWrap="wrap"
                        paddingTop={2}
                    >
                        {categories.map(item => (
                            <Barge
                                key={item.key}
                                isActive={item.id === categorySelected}
                                onSelect={handleSelectType}
                                item={item}
                            />
                        ))}
                    </CustomBox>

                    <CustomGrid container flex={75} paddingTop={2}>
                        {medias.map(item => (
                            <Images
                                key={item.id}
                                isActive={item.id === mediaSelected}
                                item={item}
                                onSelect={handleSelectBackground}
                            />
                        ))}
                    </CustomGrid>
                </CustomGrid>
            </CustomPaper>
        </Fade>
    );
};

export const MeetingChangeBackground = memo(Component);
