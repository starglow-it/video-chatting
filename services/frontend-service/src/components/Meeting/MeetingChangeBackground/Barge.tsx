import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import clsx from 'clsx';
import { memo } from 'react';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { IMediaCategory } from 'shared-types';
import { hasHttps } from 'shared-frontend/const/regexp';
import { mapEmoji, parseEmoji } from 'shared-utils';
import styles from './MeetingChangeBackground.module.scss';

const Component = ({
    isActive = false,
    item,
    onSelect,
}: {
    isActive: boolean;
    item: IMediaCategory & { id: string };
    onSelect: (id: string) => void;
}) => {
    const { emojiUrl } = item;
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
                {new RegExp(hasHttps).test(emojiUrl) ? (
                    <CustomImage width={13} height={13} src={emojiUrl} />
                ) : (
                    <CustomGrid
                        className={styles.emoji}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        {parseEmoji(mapEmoji(emojiUrl))}
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
