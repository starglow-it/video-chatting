import { MouseEvent, memo, useRef, useState } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import styles from './CategoryItem.module.scss';
import { CustomDivider } from 'shared-frontend/library/custom/CustomDivider';
import { IBackgroundCategory } from 'src/store/backgrounds/types';
import { ModifyCategoryItem } from '../ModifyCategoryItem/ModifyCategoryItem';
import { Fade } from '@mui/material';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { EditIcon } from 'shared-frontend/icons/OtherIcons/EditIcon';
import { TrashIcon } from 'shared-frontend/icons/OtherIcons/TrashIcon';
import clsx from 'clsx';
import { hasHttps } from 'shared-frontend/const/regexp';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { mapEmoji, parseEmoji } from 'shared-utils';

const Component = ({
    category,
    isActive,
    onClick,
    onSave,
    onDelete,
}: {
    category: IBackgroundCategory;
    isActive: boolean;
    onClick: (categoryId: string) => void;
    onSave: (category: IBackgroundCategory) => void;
    onDelete: (categoryId: string) => void;
}) => {
    const { emojiUrl } = category;
    const refModify = useRef(null);
    const [isHover, setIsHover] = useState<boolean>(false);

    const showActions = () => setIsHover(true);

    const hideActions = () => setIsHover(false);

    const toggleEdit = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        refModify.current?.open();
    };

    const deleteCategory = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onDelete(category.id);
    };

    return (
        <CustomGrid
            className={clsx(styles.wrapper, { [styles.active]: isActive })}
            flexDirection="row"
            display="flex"
            onMouseEnter={showActions}
            onMouseLeave={hideActions}
            onClick={() => onClick(category.id)}
        >
            <CustomGrid container flexDirection="row" alignItems="center">
                <CustomGrid className={styles.emoji}>
                    {new RegExp(hasHttps).test(emojiUrl) ? (
                        <CustomImage width={20} height={20} src={emojiUrl} />
                    ) : (
                        parseEmoji(mapEmoji(emojiUrl))
                    )}
                </CustomGrid>
                <CustomTypography fontSize={13}>
                    {category.value}
                </CustomTypography>
            </CustomGrid>
            <Fade in={isHover}>
                <CustomGrid
                    alignItems="center"
                    flexDirection="row"
                    display="flex"
                >
                    <ActionButton
                        variant="decline"
                        Icon={<EditIcon width="17px" height="17px" />}
                        onAction={toggleEdit}
                        className={styles.editIcon}
                    />
                    <ActionButton
                        variant="decline"
                        Icon={<TrashIcon width="20px" height="20px" />}
                        className={styles.editIcon}
                        onAction={deleteCategory}
                    />
                </CustomGrid>
            </Fade>
            <ModifyCategoryItem
                ref={refModify}
                category={category}
                onSave={onSave}
            />
        </CustomGrid>
    );
};
export const CategoryItem = memo(Component);
