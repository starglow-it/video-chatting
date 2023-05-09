import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import clsx from 'clsx';
import { memo } from 'react';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { IMediaCategory } from 'shared-types';
import styles from './MeetingChangeBackground.module.scss';
import { hasHttps } from 'shared-frontend/const/regexp';

const Component = ({
    isActive = false,
    item,
    onSelect,
}: {
    isActive: boolean;
    item: IMediaCategory & { id: string };
    onSelect: (id: string) => void;
}) => {
    const getEmoji = () => {
        return String.fromCodePoint.apply(
            null,
            item.emojiUrl.split('-').map(item => '0x'.concat(item)),
        );
    };

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
                {new RegExp(hasHttps).test(item.emojiUrl) ? (
                    <CustomImage
                        width={13}
                        height={13}
                        src={item.emojiUrl}
                    />
                ) : (
                    <CustomGrid
                        className={styles.emoji}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        {getEmoji()}
                    </CustomGrid>
                )}

                <CustomTypography
                    color={
                        isActive
                            ? 'colors.black.primary'
                            : 'colors.white.primary'
                    }
                    variant="button"
                    fontSize={11}
                    className={styles.button}
                >
                    {item.value}
                </CustomTypography>
            </CustomBox>
        </CustomGrid>
    );
};

export const Barge = memo(Component);
