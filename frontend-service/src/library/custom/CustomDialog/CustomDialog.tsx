import React, { memo } from 'react';
import { Dialog, DialogActions, DialogContent, DialogProps } from '@mui/material';

// icons
import { RoundCloseIcon } from '@library/icons/RoundIcons/RoundCloseIcon';

// types
import { CustomDialogProps } from './types';

type ComponentType = Omit<DialogProps, 'onClose'> & CustomDialogProps;

import styles from './CustomDialog.module.scss';

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
                <DialogActions classes={{ root: styles.closeIcon }}>
                    <RoundCloseIcon onClick={onClose} width="24px" height="24px" />
                </DialogActions>
            )}
        </Dialog>
    );
};

export const CustomDialog = memo<ComponentType>(Component);
