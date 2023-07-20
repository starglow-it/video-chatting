import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';

import { Theme } from '@mui/material';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// styles
import styles from '@components/Profile/MainInfo/MainInfo.module.scss';

// stores
import { $profileStore } from '../../../store';

// const
const DEFAULT_HEIGHT = 44;

const ProfileDescription = memo(() => {
    const profileState = useStore($profileStore);

    const [descriptionHeight, setDescriptionHeight] =
        useState<number>(DEFAULT_HEIGHT);
    const [showDescription, setShowDescription] = useState(false);
    const [isShowDescriptionEnabled, setIsShowDescriptionEnabled] =
        useState(true);

    const descriptionRef = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        const rect = descriptionRef?.current?.getBoundingClientRect();

        if (rect?.height < DEFAULT_HEIGHT) {
            setIsShowDescriptionEnabled(false);
        }
        setDescriptionHeight(
            !showDescription ? DEFAULT_HEIGHT : rect?.height || DEFAULT_HEIGHT,
        );
    }, [showDescription]);

    const handleToggleDescription = useCallback(() => {
        setShowDescription(prev => !prev);
    }, []);

    return (
        <CustomGrid container alignItems="flex-end">
            <CustomGrid
                className={clsx(styles.profileDescription, {
                    [styles.hide]: !showDescription,
                })}
                sx={{
                    height: `${descriptionHeight}px`,
                    transition: (theme: Theme) =>
                        theme.transitions.create(['all'], {
                            duration: 200,
                        }),
                }}
            >
                <CustomTypography
                    className={styles.description}
                    ref={descriptionRef}
                    variant="body2"
                >
                    {profileState?.description}
                </CustomTypography>
            </CustomGrid>
            {isShowDescriptionEnabled && (
                <CustomTypography
                    onClick={handleToggleDescription}
                    className={styles.expandBtn}
                    color="colors.blue.primary"
                    nameSpace="common"
                    translation={showDescription ? 'hide' : 'more'}
                />
            )}
        </CustomGrid>
    );
});

export { ProfileDescription };
