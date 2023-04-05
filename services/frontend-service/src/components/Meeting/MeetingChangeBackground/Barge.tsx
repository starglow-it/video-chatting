import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import clsx from 'clsx';
import { memo } from 'react';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import styles from './MeetingChangeBackground.module.scss';

const Component = ({
    isActive = false,
    item,
    onSelect,
}: {
    isActive: boolean;
    item: any;
    onSelect: (id: string) => void;
}) => {
    console.log(isActive);

    return (
        <CustomGrid
            className={clsx(styles.barge, { [styles.active]: isActive })}
            onClick={() => onSelect(item.id)}
        >
            <CustomBox
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
            >
                <CustomTypography
                    title={item.name}
                    color={
                        isActive
                            ? 'colors.black.primary'
                            : 'colors.white.primary'
                    }
                    variant="button"
                    fontSize={10}
                    className={styles.button}
                />
            </CustomBox>
        </CustomGrid>
    );
};

export const Barge = memo(Component);
