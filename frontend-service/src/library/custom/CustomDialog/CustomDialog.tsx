import React, { memo } from 'react';
import { Dialog, DialogActions, DialogContent, DialogProps } from '@mui/material';

// icons
import { RoundCloseIcon } from '@library/icons/RoundCloseIcon';

// types
import { CustomDialogProps } from './types';

type ComponentType = Omit<DialogProps, 'onClose'> & CustomDialogProps;

const Component = ({
    open,
    onClose,
    children,
    contentClassName,
    ...rest
}: Omit<DialogProps, 'onClose'> & CustomDialogProps) => {
    return (
        <Dialog open={open} {...rest}>
            <DialogContent className={contentClassName || ''}>{children}</DialogContent>
            {onClose && (
                <DialogActions>
                    <RoundCloseIcon onClick={onClose} width="24px" height="24px" />
                </DialogActions>
            )}
        </Dialog>
    );
};

export const CustomDialog = memo<ComponentType>(Component);
