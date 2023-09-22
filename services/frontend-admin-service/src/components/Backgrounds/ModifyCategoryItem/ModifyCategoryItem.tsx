import {
    ForwardedRef,
    MouseEvent,
    forwardRef,
    memo,
    useImperativeHandle,
    useState,
} from 'react';
import EmojiPicker from 'emoji-picker-react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { IBackgroundCategory } from 'src/store/backgrounds/types';
import { CustomInput } from 'shared-frontend/library/custom/CustomInput';
import { ClickAwayListener, InputAdornment } from '@mui/material';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CloseIcon } from 'shared-frontend/icons/OtherIcons/CloseIcon';
import { AcceptIcon } from 'shared-frontend/icons/OtherIcons/AcceptIcon';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import clsx from 'clsx';
import { mapEmoji, parseEmoji } from 'shared-utils';
import styles from './ModifyCategoryItem.module.scss';

const Component = (
    {
        category,
        onSave,
        className,
    }: {
        category: IBackgroundCategory;
        onSave: (category: IBackgroundCategory) => void;
        className?: string;
    },
    ref: ForwardedRef<{
        open: () => void;
        close: () => void;
    }>,
) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [categoryName, setCategoryName] = useState<string>(category.value);
    const [isPreviewEmoji, setIsPreviewEmoji] = useState<boolean>(false);
    const [emoji, setEmoji] = useState<string>(category.emojiUrl);

    const open = () => {
        setIsOpen(true);
        setCategoryName(category.value);
    };

    const close = (e: MouseEvent<HTMLButtonElement> | null = null) => {
        if (e) {
            e.stopPropagation();
        }
        setIsOpen(false);
        setIsPreviewEmoji(false);
    };

    useImperativeHandle(ref, () => ({
        open,
        close,
    }));

    if (!isOpen) return null;

    const onChangeCategoryName = e => {
        setCategoryName(e.target.value);
    };

    const togglePreviewEmoji = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsPreviewEmoji(!isPreviewEmoji);
    };

    const handleEmojiClick = (emojiData: any, e: MouseEvent) => {
        e.stopPropagation();
        setEmoji(emojiData.unified);
    };

    const save = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (categoryName) {
            onSave({
                ...category,
                key: categoryName.toLocaleLowerCase(),
                value: categoryName,
                emojiUrl: emoji,
            });
            close();
            setIsPreviewEmoji(false);
        }
    };

    return (
        <CustomGrid
            className={clsx(className, styles.wrapper)}
            container
            flexDirection="row"
            alignItems="center"
        >
            <CustomGrid flex={1} display="flex">
                <CustomInput
                    color="primary"
                    onChange={onChangeCategoryName}
                    value={categoryName}
                    inputProps={{ className: styles.textField }}
                    autoFocus
                    // eslint-disable-next-line react/jsx-no-duplicate-props
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <CustomGrid
                                    className={styles.emoji}
                                    onClick={togglePreviewEmoji}
                                >
                                    {parseEmoji(mapEmoji(emoji))}
                                </CustomGrid>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <ActionButton
                                    Icon={
                                        <AcceptIcon
                                            width="20px"
                                            height="20px"
                                        />
                                    }
                                    className={styles.closeIcon}
                                    onAction={save}
                                    variant="decline"
                                />

                                <ActionButton
                                    Icon={
                                        <CloseIcon width="20px" height="20px" />
                                    }
                                    className={styles.closeIcon}
                                    onAction={close}
                                    variant="decline"
                                />
                            </InputAdornment>
                        ),
                    }}
                />
            </CustomGrid>

            <ConditionalRender condition={isPreviewEmoji}>
                <ClickAwayListener onClickAway={close}>
                    <EmojiPicker
                        height={250}
                        searchDisabled
                        onEmojiClick={handleEmojiClick}
                        previewConfig={{ showPreview: false }}
                    />
                </ClickAwayListener>
            </ConditionalRender>
        </CustomGrid>
    );
};
export const ModifyCategoryItem = memo(forwardRef(Component));
