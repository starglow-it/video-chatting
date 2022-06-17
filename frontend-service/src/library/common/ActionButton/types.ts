import React from 'react';

export type ActionButtonProps = {
    onAction?: (() => void) | undefined | null;
    Icon: React.ReactElement;
    variant?: 'danger' | 'decline' | 'accept' | 'common' | 'cancel' | 'transparent' | 'transparentBlack' | undefined;
};
