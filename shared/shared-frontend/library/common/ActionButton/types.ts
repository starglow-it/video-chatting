import React from 'react';

export type ActionButtonProps = {
    onAction?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | undefined | null;
    Icon: React.ReactElement;
    variant?:
        | 'danger'
        | 'decline'
        | 'accept'
        | 'common'
        | 'cancel'
        | 'transparent'
        | 'transparentBlack'
        | 'transparentPrimary'
        | 'gray'
        | 'black'
        | undefined;
};
