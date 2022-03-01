import React, { memo } from 'react';
import { Dialog, DialogActions, DialogContent, DialogProps } from '@mui/material';
import { CloseIcon } from '@library/icons/CloseIcon';
import { CustomDialogProps } from './types';

const CustomDialog = memo(
    ({
        open,
        onClose,
        children,
        contentClassName,
        ...rest
    }: Omit<DialogProps, 'onClose'> & CustomDialogProps) => {
        return (
            <Dialog open={open} {...rest}>
                <DialogContent className={contentClassName}>{children}</DialogContent>
                {onClose && (
                    <DialogActions>
                        <CloseIcon onClick={onClose} width="24px" height="24px" />
                    </DialogActions>
                )}
            </Dialog>
        );
    },
);

export { CustomDialog };
