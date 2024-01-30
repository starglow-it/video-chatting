import { MouseEvent, memo, useRef } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { IBackgroundCategory } from 'src/store/backgrounds/types';
import { Fade } from '@mui/material';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { EditIcon } from 'shared-frontend/icons/OtherIcons/EditIcon';
import { TrashIcon } from 'shared-frontend/icons/OtherIcons/TrashIcon';
import clsx from 'clsx';
import { hasHttps } from 'shared-frontend/const/regexp';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { mapEmoji, parseEmoji } from 'shared-utils';
import { useToggle } from 'shared-frontend/hooks/useToggle';
import { ModifyCategoryItem } from '../ModifyCategoryItem/ModifyCategoryItem';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import styles from './CategoryItem.module.scss';

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
    const {
        value: isHover,
        onSwitchOn: showActions,
        onSwitchOff: hideActions,
    } = useToggle(false);

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
                        <CustomImage
                            width={20}
                            height={20}
                            src={emojiUrl}
                            alt="gategory-item"
                        />
                    ) : (
                        parseEmoji(mapEmoji(emojiUrl))
                    )}
                </CustomGrid>
                <CustomTypography fontSize={13}>
                    {category.value}
                </CustomTypography>
            </CustomGrid>
            <ConditionalRender condition={category.key !== 'myrooms'}>
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
            </ConditionalRender>
            <ModifyCategoryItem
                ref={refModify}
                category={category}
                onSave={onSave}
            />
        </CustomGrid>
    );
};
export const CategoryItem = memo(Component);
