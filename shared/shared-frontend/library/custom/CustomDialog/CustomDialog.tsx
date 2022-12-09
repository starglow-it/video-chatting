import React, { memo } from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// icons
import { RoundCloseIcon } from '../../../icons/RoundIcons/RoundCloseIcon';

// types
import { CustomDialogProps } from './types';

import styles from './CustomDialog.module.scss';

type ComponentType = Omit<DialogProps, 'onClose'> & CustomDialogProps;

const Component = ({
    open,
    onClose,
    children,
    contentClassName,
    className,
    withNativeCloseBehavior = false,
    withCloseButton = true,
    ...rest
}: Omit<DialogProps, 'onClose'> & CustomDialogProps) => (
    <Dialog
        classes={{ paper: className }}
        open={open}
        onClose={withNativeCloseBehavior ? onClose : undefined}
        {...rest}
    >
        <DialogContent className={contentClassName || ''}>{children}</DialogContent>
        {onClose && withCloseButton && (
            <DialogActions classes={{ root: styles.closeIcon }}>
                <RoundCloseIcon onClick={onClose} width="24px" height="24px" />
            </DialogActions>
        )}
    </Dialog>
);

const CustomDialog = memo<ComponentType>(Component);

export default CustomDialog;
