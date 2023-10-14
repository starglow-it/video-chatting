import { forwardRef, useImperativeHandle, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { ClickAwayListener } from '@mui/base';
import { PickerConfig } from 'emoji-picker-react/dist/config/config';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { PropsWithClassName } from 'shared-frontend/types';

export const CustomEmojiPicker = forwardRef(
    (
        {
            onEmojiClick,
            className = '',
            ...config
        }: PickerConfig & PropsWithClassName,
        ref,
    ) => {
        const [isOpen, setIsOpen] = useState(false);

        const close = () => {
            setIsOpen(false);
        };

        useImperativeHandle(ref, () => ({
            open: () => setIsOpen(true),
        }));

        if (!isOpen) return null;

        return (
            <ClickAwayListener onClickAway={close}>
                <CustomGrid className={className}>
                    <EmojiPicker
                        height={250}
                        searchDisabled
                        onEmojiClick={onEmojiClick}
                        previewConfig={{ showPreview: false }}
                        {...config}
                    />
                </CustomGrid>
            </ClickAwayListener>
        );
    },
);
