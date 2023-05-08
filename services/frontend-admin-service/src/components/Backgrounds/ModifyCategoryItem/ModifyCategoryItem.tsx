import {
    ForwardedRef,
    forwardRef,
    memo,
    useImperativeHandle,
    useState,
} from 'react';
import EmojiPicker from 'emoji-picker-react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import styles from './ModifyCategoryItem.module.scss';
import { IBackgroundCategory } from 'src/store/backgrounds/types';
import { CustomInput } from 'shared-frontend/library/custom/CustomInput';
import { InputAdornment } from '@mui/material';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CloseIcon } from 'shared-frontend/icons/OtherIcons/CloseIcon';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';

const Component = (
    { category }: { category: IBackgroundCategory },
    ref: ForwardedRef<{
        open: () => void;
        close: () => void;
        getStatus: () => void;
    }>,
) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [categoryName, setCategoryName] = useState<string>(category.value);
    const [isPreviewEmoji, setIsPreviewEmoji] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
        open,
        close,
        getStatus: () => isOpen,
    }));

    const open = () => {
        setIsOpen(true);
        setCategoryName(category.value);
    };

    const close = () => {
        setIsOpen(false)
    }

    if (!isOpen) return null;

    const onChangeCategoryName = e => {
        setCategoryName(e.target.value);
    };

    const togglePreviewEmoji = () => {
        setIsPreviewEmoji(!isPreviewEmoji);
    };

    return (
        <CustomGrid
            className={styles.wrapper}
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
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <CustomGrid
                                    className={styles.emoji}
                                    onClick={togglePreviewEmoji}
                                >
                                    {String.fromCodePoint('0x1f600')}
                                </CustomGrid>
                            </InputAdornment>
                        ),
                    }}
                />
            </CustomGrid>

            <ActionButton
                // variant="decline"
                Icon={<CloseIcon width="25px" height="25px" />}
                className={styles.closeIcon}
                onAction={close}
            />
            <ConditionalRender condition={isPreviewEmoji}>
                <EmojiPicker height={250} searchDisabled />
            </ConditionalRender>
        </CustomGrid>
    );
};
export const ModifyCategoryItem = memo(forwardRef(Component));
